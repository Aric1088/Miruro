import { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaPlay } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { useNavigate } from 'react-router-dom';
import BannerNotFound from '/src/assets/miruro-banner-dark-bg.webp';
import { SkeletonSlide } from '../../index';
import { TbCardsFilled } from 'react-icons/tb';
import { FaStar } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa6';
import { Anime } from '../../hooks/interface';

const StyledSwiperContainer = styled(Swiper)`
  position: relative;
  max-width: 100%;
  height: 24rem;
  border-radius: var(--global-border-radius);
  cursor: grab;

  @media (max-width: 1000px) {
    height: 20rem;
  }
  @media (max-width: 500px) {
    height: 18rem;
  }
`;

const StyledSwiperSlide = styled(SwiperSlide)`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  animation: ${keyframes`
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  `} 0.3s ease-in-out forwards;
`;

const DarkOverlay = styled.div`
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: var(--global-border-radius);
  z-index: 1;
  background: linear-gradient(45deg, rgba(8, 8, 8, 1) 0%, transparent 55%);
`;

const SlideImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--global-border-radius);
`;

const SlideImage = styled.img<{ $cover: string; $image: string }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--global-border-radius);
  position: absolute;
  content: ${(props) =>
    props.$cover === props.$image ? BannerNotFound : props.$cover};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const SlideContent = styled.div`
  position: absolute;
  left: 2rem;
  bottom: 1.5rem;
  z-index: 5;
  max-width: 60%;

  animation: ${keyframes`
  0% {
    opacity: 0.4;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0%);
  }
`} 0.3s ease-in-out forwards;

  @media (max-width: 1000px) {
    left: 1rem;
    bottom: 1.5rem;
  }
`;

const SlideTitle = styled.h2`
  color: var(--white, #fff);
  font-size: clamp(1.2rem, 3vw, 3rem);
  margin: auto;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 500px) {
    white-space: nowrap;
    max-width: 100%;
  }
`;

const SlideInfo = styled.p`
  color: var(--white, #fff);
  font-size: 0.9rem;
  margin: auto;
  max-width: 100%;
  overflow: hidden;
  margin-top: 0.5rem;
  text-overflow: ellipsis;
  svg {
    margin-left: 0.5rem;
  }
  @media (max-width: 1000px) {
    font-size: 0.8rem;
  }
  @media (max-width: 500px) {
    font-size: 0.7rem;
  }
`;

const SlideDescription = styled.p<{
  $maxLines: boolean;
}>`
  color: var(--white, #ccc);
  background: transparent;
  font-size: clamp(0.9rem, 1.5vw, 0.9rem);
  line-height: 1.2;
  margin-bottom: 0;
  max-width: 60%;
  max-height: 5rem;
  overflow: hidden;
  -webkit-line-clamp: 3;
  margin-top: 0.25rem;

  @media (max-width: 1000px) {
    line-height: 1.2;
    max-width: 70%;
    font-size: clamp(0.8rem, 1.2vw, 0.9rem);
    max-height: 3rem;
  }

  @media (max-width: 500px) {
    max-width: 100%;
    font-size: clamp(0.7rem, 1vw, 0.8rem);
    max-height: 2.5rem;
  }

  /* Add overflow-y: auto if the content exceeds max height */
  overflow-y: ${({ $maxLines }) => ($maxLines ? 'auto' : 'hidden')};
`;

const PlayButtonWrapper = styled.div`
  position: absolute;
  right: 2rem;
  bottom: 1.5rem;
  z-index: 5;
  display: flex;
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */

  @media (max-width: 1000px) {
    right: 1.5rem;
    bottom: 1.5rem;
  }
`;

const PlayButton = styled.button`
  background-color: var(--global-button-bg);
  color: var(--global-text);
  border: none;
  border-radius: 0.4rem;
  font-size: 1rem; /* Increased font size */
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
  padding: 1.2rem 2rem; /* Increased padding */
  display: flex;
  align-items: center;

  &:hover,
  &:active,
  &:focus {
    background-color: var(--primary-accent-bg);
    transform: scale(1.05); /* Slightly larger scale on hover */
  }

  @media (max-width: 1000px) {
    padding: 1rem 2rem; /* Adjusted for medium-sized devices */
  }

  @media (max-width: 500px) {
    border-radius: 50%;
    padding: 1.4rem; /* Adjusted for small devices */
    padding-right: 1.5rem;
    font-size: 1.25rem; /* Adjusted font size for small devices */
    span {
      display: none;
    }
  }
`;

const PlayIcon = styled(FaPlay)`
  margin-right: 0.5rem;
  @media (max-width: 500px) {
    margin-right: 0;
  }
`;
const PaginationStyle = styled.div`
  .swiper-pagination-bullet {
    background: var(--global-primary-bg, #007bff);
    opacity: 0.7;
    margin: 0 3px;
  }

  .swiper-pagination-bullet-active {
    background: var(--global-text);
    opacity: 1;
  }
`;

// Adjust the Carousel component to use correctly typed props and state
interface HomeCarouselProps {
  data: Anime[];
  loading: boolean;
  error?: string | null;
}

export const HomeCarousel: FC<HomeCarouselProps> = ({
  data = [],
  loading,
  error,
}) => {
  const navigate = useNavigate();

  const handlePlayButtonClick = (id: string) => {
    navigate(`/watch/${id}`);
  };

  const truncateTitle = (title: string, maxLength: number = 40): string => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  const validData = data.filter(
    (item) => item.title && item.title.english && item.description,
  );
  const formatGenres = (genres: string[]): string => genres.join(', ');
  return (
    <>
      {loading || error ? (
        <SkeletonSlide />
      ) : (
        <PaginationStyle>
          <StyledSwiperContainer
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            // autoplay={{
            //   delay: 3000,
            //   disableOnInteraction: false,
            // }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              el: '.swiper-pagination',
              clickable: true,
              dynamicBullets: true,
              type: 'bullets',
            }}
            freeMode={false}
            virtual={true}
            grabCursor={true}
            keyboard={true}
            touchRatio={1}
            centeredSlides={true}
          >
            {validData.map(
              ({
                id,
                image,
                cover,
                title,
                description,
                status,
                rating,
                genres,
                totalEpisodes,
                duration,
                type,
              }) => (
                <StyledSwiperSlide
                  key={id}
                  title={title.english || title.romaji}
                >
                  <SlideImageWrapper>
                    <SlideImage
                      src={cover === image ? BannerNotFound : cover}
                      alt={title.english || title.romaji + ' Banner Image'}
                      $cover={cover}
                      $image={image}
                      loading='eager'
                    />
                    <ContentWrapper>
                      <SlideContent>
                        <SlideTitle>{truncateTitle(title.english)}</SlideTitle>
                        <SlideInfo>
                          {type} <TbCardsFilled /> {totalEpisodes} <FaStar />{' '}
                          {rating}
                          <FaClock /> {duration} mins
                        </SlideInfo>
                        <SlideDescription
                          dangerouslySetInnerHTML={{ __html: description }}
                          $maxLines={description.length > 200}
                        />
                      </SlideContent>
                      <PlayButtonWrapper>
                        <PlayButton
                          onClick={() => handlePlayButtonClick(id)}
                          title={
                            'Watch ' + (title.english || title.romaji) + ' Now'
                          }
                        >
                          <PlayIcon />
                          <span>WATCH NOW</span>
                        </PlayButton>
                      </PlayButtonWrapper>
                    </ContentWrapper>
                    <DarkOverlay />
                  </SlideImageWrapper>
                </StyledSwiperSlide>
              ),
            )}
            <div className='swiper-pagination'></div>
          </StyledSwiperContainer>
        </PaginationStyle>
      )}
    </>
  );
};
