import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getResults } from '../utils/csvHandler';
import { OPTION_NAMES } from '../utils/constants';
import styled from 'styled-components';
import backgroundImage from '@/app/image/wallpaper.png'

const ResultContainer = styled.div`
  font-family: 'LG Smart', sans-serif;
  background-image: url(${backgroundImage.src});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  color: white;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 100px;
  font-weight: bold;
  font-family: 'LG Smart', sans-serif;
  padding-top: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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

const RankImage = styled.div<{ rank: number }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: none;
  background: ${props => {
    switch (props.rank) {
      case 1:
        return 'linear-gradient(135deg, #FFD700, #FDB931)';
      case 2:
        return 'linear-gradient(135deg, #C0C0C0, #E8E8E8)';
      case 3:
        return 'linear-gradient(135deg, #CD7F32, #FFA07A)';
      default:
        return 'rgba(159, 255, 156, 0.1)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  padding: 10px;
  text-align: center;
  position: relative;
  flex-direction: column;
  gap: 5px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    width: 140px;
    height: 140px;
    background: url('/wreath.png') no-repeat center center;
    background-size: contain;
    z-index: -1;
    opacity: ${props => props.rank === 1 ? 1 : props.rank === 2 ? 0.9 : 0.8};
  }
`;

const VoteCount = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const VotePercentage = styled.div`
  color: #1C1C1C;
  font-weight: bold;
  font-size: 18px;
`;

const Crown = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
`;

const RankInfo = styled.div<{ rank: number }>`
  margin-top: 10px;
  color: white;
  font-size: ${props => props.rank === 1 ? '18px' : props.rank === 2 ? '16px' : '14px'};
`;

const Score = styled.div<{ rank: number }>`
  color: #9fff9c;
  font-weight: bold;
  margin-top: 5px;
  font-size: ${props => props.rank === 1 ? '24px' : props.rank === 2 ? '20px' : '18px'};
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

const Stars = styled.div<{ rank: number }>`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3px;

  &::before {
    content: '⭐'.repeat(5);
    color: ${props => props.rank === 1 ? '#FFD700' : props.rank === 2 ? '#C0C0C0' : '#CD7F32'};
    font-size: 12px;
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
        <Title>24년도 ID사업부 기술성과 공유회</Title>
        <TopThree>
          {getTopThree().map(([option, votes], index) => {
            const actualRank = index === 1 ? 1 : index === 0 ? 2 : 3;
            const percentage = ((votes / totalVotes) * 100).toFixed(1);
            
            return (
              <RankCircle key={option} rank={actualRank}>
                <Stars rank={actualRank} />
                <RankImage rank={actualRank}>
                  {actualRank === 1 && <Crown>👑</Crown>}
                  <VoteCount>{votes.toLocaleString()}표</VoteCount>
                  <VotePercentage>{percentage}%</VotePercentage>
                </RankImage>
                <RankInfo rank={actualRank}>
                  <div>{option}</div>
                  <Score rank={actualRank}>{actualRank}등</Score>
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