import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import {
  SearchFilters,
  CardGrid,
  StyledCardGrid,
  fetchAdvancedSearch,
  SkeletonCard,
} from '../index';

// Define types for genre, year, season, format, and status
type Option = { value: string; label: string };
// type Genre = Option;
// type Year = Option;
// type Season = Option;
// type Format = Option;
// type Status = Option;

const Container = styled.div`
  margin-top: 1rem;

  @media (min-width: 1500px) {
    margin-left: 8rem;
    margin-right: 8rem;
    margin-top: 2rem;
  }
`;

const anyOption: Option = { value: '', label: 'Any' };

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Directly initialize state from URL parameters
  const initialQuery = searchParams.get('query') || '';
  // Adjusting initialization to ensure non-null values
  const genresParam = searchParams.get('genres');
  const initialGenres = genresParam
    ? genresParam.split(',').map((value) => ({ value, label: value }))
    : [];

  const initialYear = {
    value: searchParams.get('year') || '', // Fallback to empty string if null
    label: searchParams.get('year') || 'Any', // Fallback to 'Any'
  };

  const initialSeason = {
    value: searchParams.get('season') || '', // Fallback to empty string if null
    label: searchParams.get('season') || 'Any', // Fallback to 'Any'
  };

  const initialFormat = {
    value: searchParams.get('format') || '', // Fallback to empty string if null
    label: searchParams.get('format') || 'Any', // Fallback to 'Any'
  };

  const initialStatus = {
    value: searchParams.get('status') || '', // Fallback to empty string if null
    label: searchParams.get('status') || 'Any', // Fallback to 'Any'
  };

  // State hooks
  const [query, setQuery] = useState(initialQuery);
  const [selectedGenres, setSelectedGenres] = useState(initialGenres);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedFormat, setSelectedFormat] = useState(initialFormat);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  //Sorting
  const [sortDirection, setSortDirection] = useState<'DESC' | 'ASC'>('DESC');
  const [selectedSort, setSelectedSort] = useState<Option>({
    value: 'POPULARITY',
    label: 'Popularity ',
  });

  //Other logic
  const [animeData, setAnimeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const delayTimeout = useRef<number | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = query ? `${query} - Miruro` : 'Miruro';
    return () => {
      document.title = previousTitle;
    };
  }, [query]);

  // useEffect hook for updating URL based on filter changes
  useEffect(() => {
    const params = new URLSearchParams();

    params.set('query', query);
    if (selectedGenres.length > 0)
      params.set('genres', selectedGenres.map((g) => g.value).join(','));
    if (selectedYear.value) params.set('year', selectedYear.value);
    if (selectedSeason.value) params.set('season', selectedSeason.value);
    if (selectedFormat.value) params.set('format', selectedFormat.value);
    if (selectedStatus.value) params.set('status', selectedStatus.value);

    setSearchParams(params, { replace: true });
  }, [
    query,
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
    setSearchParams,
  ]);

  useEffect(() => {
    setPage(1);

    const scrollToTopWithDelay = () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 250);
    };

    scrollToTopWithDelay();
  }, [query]);

  const initiateFetchAdvancedSearch = useCallback(async () => {
    setIsLoading(true);
    const sortParam = `${selectedSort.value}_${sortDirection}`;

    try {
      const yearFilter = selectedYear.value || undefined;
      const formatFilter = selectedFormat.value || undefined;
      const statusFilter = selectedStatus.value || undefined;
      const seasonFilter = selectedSeason.value || undefined;

      const fetchedData = await fetchAdvancedSearch(query, page, 17, {
        genres: selectedGenres.map((g) => g.value),
        year: yearFilter,
        season: seasonFilter,
        format: formatFilter,
        status: statusFilter,
        sort: [sortParam], // Wrap sortParam in an array
      });

      if (page === 1) {
        setAnimeData(fetchedData.results);
      } else {
        setAnimeData((prevData) => [...prevData, ...fetchedData.results]);
      }
      setHasNextPage(fetchedData.hasNextPage);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    query,
    page,
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
    sortDirection,
  ]);

  const handleLoadMore = () => {
    setPage((prevPage) => {
      return prevPage < 10 ? prevPage + 1 : prevPage;
      setHasNextPage(false);
    });
  };

  useEffect(() => {
    const newQuery = searchParams.get('query') || '';
    if (newQuery !== query) {
      setQuery(newQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    // Clear existing timeout to ensure no double fetches
    if (delayTimeout.current !== null) clearTimeout(delayTimeout.current);

    // Debounce to minimize fetches during rapid state changes
    delayTimeout.current = window.setTimeout(() => {
      initiateFetchAdvancedSearch();
    }, 0);

    // Cleanup timeout on unmount or before executing a new fetch
    return () => {
      if (delayTimeout.current !== null) clearTimeout(delayTimeout.current);
    };
  }, [initiateFetchAdvancedSearch]); // Include all dependencies here

  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedYear(anyOption);
    setSelectedSeason(anyOption);
    setSelectedFormat(anyOption);
    setSelectedStatus(anyOption);
    setSelectedSort({ value: 'POPULARITY', label: 'Popularity' }); // Assuming 'Popularity' is the default
    setSortDirection('DESC'); // Assuming 'DESC' is the default
    // Add any other states that need to be reset
  };

  return (
    <Container>
      <SearchFilters
        query={query}
        setQuery={setQuery}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedSort={selectedSort} // New
        setSelectedSort={setSelectedSort} // New
        sortDirection={sortDirection} // New
        setSortDirection={setSortDirection} // New
        resetFilters={resetFilters}
      />
      {isLoading && page === 1 ? (
        <StyledCardGrid>
          {Array.from({ length: 17 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </StyledCardGrid>
      ) : (
        <CardGrid
          animeData={animeData}
          hasNextPage={hasNextPage}
          onLoadMore={handleLoadMore}
        />
      )}
      {!isLoading && animeData.length === 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '10vh',
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}
        >
          No Results
        </div>
      )}
    </Container>
  );
};

export default Search;