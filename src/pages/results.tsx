import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getResults } from '../utils/csvHandler';
import { OPTION_NAMES } from '../utils/constants';
import styled from 'styled-components';

const ResultContainer = styled.div`
  background-color: #000;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(0, 255, 0, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 90% 50%, rgba(0, 100, 255, 0.05) 0%, transparent 30%),
    linear-gradient(to bottom, #000, #001);
  min-height: 100vh;
  padding: 20px;
  color: white;
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px 20px;
  border-radius: 20px;
  color: #9fff9c;
`;

const TopThree = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const RankCircle = styled.div<{ rank: number }>`
  text-align: center;
  position: relative;
  transform: ${props => props.rank === 1 ? 'scale(1.2)' : 'scale(1)'};
  margin-top: ${props => props.rank === 1 ? '0' : '40px'};
`;

const RankImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #9fff9c;
  background-color: rgba(159, 255, 156, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  padding: 10px;
  text-align: center;
  position: relative;
`;

const Crown = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
`;

const RankInfo = styled.div`
  margin-top: 10px;
  color: white;
`;

const Score = styled.div`
  color: #9fff9c;
  font-weight: bold;
  margin-top: 5px;
`;

const ListContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(5px);
  max-height: 500px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(159, 255, 156, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(159, 255, 156, 0.5);
    }
  }
`;

const RankItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

interface ResultsProps {
  results: Record<string, number>;
  totalVotes: number;
}

export default function Results({ results, totalVotes }: ResultsProps) {
  const sortedResults = Object.entries(results)
    .sort(([, a], [, b]) => b - a);

  const getTopThree = () => {
    const [first, second, third] = sortedResults;
    return [second, first, third];
  };

  // Create an array of all options with 0 votes for unvoted options
  const allOptions = Object.values(OPTION_NAMES);
  const resultsWithZeros = allOptions.map(option => {
    const votes = results[option] || 0;
    return [option, votes];
  }).sort(([, a], [, b]) => (b as number) - (a as number));

  return (
    <ResultContainer>
      <ContentWrapper>
        <Header>
          <Title>
            24년도 ID사업부<br />
            기술 성과 공유회
          </Title>
        </Header>

        <TopThree>
          {getTopThree().map(([option, votes], index) => {
            const actualRank = index === 1 ? 1 : index === 0 ? 2 : 3;
            return (
              <RankCircle key={option} rank={actualRank}>
                <RankImage>
                  {actualRank === 1 && <Crown>👑</Crown>}
                  {option}
                </RankImage>
                <RankInfo>
                  <div>{option}</div>
                  <Score>{votes.toLocaleString()}</Score>
                </RankInfo>
              </RankCircle>
            );
          })}
        </TopThree>

        <ListContainer>
          {resultsWithZeros.slice(3).map(([option, votes], index) => (
            <RankItem key={option}>
              <div style={{ width: '30px', color: '#9fff9c' }}>{index + 4}</div>
              <div style={{ flex: 1 }}>{option}</div>
              <div style={{ color: '#9fff9c' }}>{votes.toLocaleString()}</div>
            </RankItem>
          ))}
        </ListContainer>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" style={{ color: '#9fff9c', textDecoration: 'none' }}>
            ← Back to Vote
          </Link>
        </div>
      </ContentWrapper>
    </ResultContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await getResults();
  return { props: data };
}; 