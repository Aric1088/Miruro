import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Styled Components
const SeasonCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 500px) {
    justify-content: center;
  }
`;

const SeasonCard = styled.div`
  background-size: cover;
  background-position: center;
  padding: 0.9rem;
  height: 6rem;
  width: 20rem;
  @media (max-width: 500px) {
    height: 3rem;
    width: 8rem;
    padding: 1.3rem;
  }
  position: relative;
  display: flex;
  align-items: center; /* Center children vertically */
  justify-content: center; /* Center children horizontally */
  text-align: center; /* Ensure text is centered */
  border-radius: 1rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Dark overlay */
    border-radius: var(
      --global-border-radius
    ); /* Match parent's border radius */
    z-index: 1;
  }
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2; /* Ensure content is above the overlay */
`;

const SeasonName = styled.div`
  font-size: 0.9rem;
  @media (max-width: 500px) {
    display: none;
    width: 8rem;
    font-size: 0.8rem;
  }
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const RelationType = styled.div`
  font-size: 1.3rem;
  @media (max-width: 500px) {
    font-size: 1.1rem;
    width: 8rem;
    margin-bottom: 0.25rem;
  }
  font-weight: bold;
  color: white;
  border-radius: var(--global-border-radius);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.75rem;
`;

interface AnimeRelation {
  id: number;
  malId: number;
  relationType: string;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  status: string;
  episodes: number | null;
  image: string;
  imageHash: string;
  cover: string;
  coverHash: string;
  rating: number;
  type: string;
}

interface SeasonsProps {
  relations: AnimeRelation[];
}

const Seasons: React.FC<SeasonsProps> = ({ relations }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle card click
  const handleCardClick = (id: number) => {
    navigate(`/watch/${id}`); // Navigate to the corresponding anime page
  };

  // Sort relations so that PREQUELs come before SEQUELs
  const sortedRelations = relations.sort((a, b) => {
    if (a.relationType === 'PREQUEL' && b.relationType !== 'PREQUEL') {
      return -1; // a comes first
    }
    if (a.relationType !== 'PREQUEL' && b.relationType === 'PREQUEL') {
      return 1; // b comes first
    }
    return 0; // no change in order
  });

  return (
    <SeasonCardContainer>
      {sortedRelations.map((relation) => (
        <SeasonCard
          key={relation.id}
          style={{ backgroundImage: `url(${relation.image})` }}
          onClick={() => handleCardClick(relation.id)} // Add the onClick event handler
        >
          <Content>
            <RelationType>{relation.relationType}</RelationType>
            <SeasonName>
              {}
              {relation.title.english ||
                relation.title.romaji ||
                relation.title.userPreferred}
            </SeasonName>
          </Content>
        </SeasonCard>
      ))}
    </SeasonCardContainer>
  );
};

export default Seasons;