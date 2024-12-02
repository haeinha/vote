import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { getResults } from "../utils/csvHandler";
import { OPTION_NAMES } from "../utils/constants";
import styled from "styled-components";
import backgroundImage from "@/app/image/cutton.png";
// import backgroundImage from "@/app/image/snow.png";
import { useState, useEffect } from "react";

const ResultContainer = styled.div`
  font-family: "LG Smart", sans-serif;
  background-image: url(${backgroundImage.src});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  color: white;
  display: flex;
  justify-content: center;

  &::before {
    content: "";
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
  width: 95%;
  max-width: 3840px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: white;
  font-size: 4rem;
  text-align: center;
  margin-bottom: 120px;
  font-weight: bold;
  font-family: "LG Smart", sans-serif;
  padding-top: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const TopThree = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-bottom: 30px;
  padding: 0 10%;
`;

const RankCircle = styled.div<{ rank: number }>`
  text-align: center;
  position: relative;
  transform: ${(props) => (props.rank === 1 ? "scale(1.2)" : "scale(1)")};
  margin-top: ${(props) => (props.rank === 1 ? "0" : "40px")};
`;

const RankImage = styled.div<{ rank: number }>`
  width: ${(props) =>
    props.rank === 1 ? "300px" : props.rank === 2 ? "260px" : "220px"};
  height: ${(props) =>
    props.rank === 1 ? "300px" : props.rank === 2 ? "260px" : "220px"};
  border-radius: 50%;
  border: none;
  background: ${(props) => {
    switch (props.rank) {
      case 1:
        return "linear-gradient(135deg, #FFD700, #FDB931)";
      case 2:
        return "linear-gradient(135deg, #C0C0C0, #E8E8E8)";
      case 3:
        return "linear-gradient(135deg, #CD7F32, #FFA07A)";
      default:
        return "rgba(159, 255, 156, 0.1)";
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
`;

interface VoteCountProps {
  rank: number;
}

const VoteCount = styled.div<VoteCountProps>`
  font-size: ${(props) =>
    props.rank === 1 ? "32px" : props.rank === 2 ? "28px" : "24px"};
  font-weight: bold;
`;

const VotePercentage = styled.div<VoteCountProps>`
  color: #1c1c1c;
  font-weight: bold;
  font-size: ${(props) =>
    props.rank === 1 ? "32px" : props.rank === 2 ? "28px" : "24px"};
`;

const Crown = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
`;

const RankInfo = styled.div<{ rank: number }>`
  margin-top: 20px;
  color: white;
  font-size: ${(props) =>
    props.rank === 1 ? "24px" : props.rank === 2 ? "22px" : "20px"};
  text-align: center;
  max-width: ${(props) =>
    props.rank === 1 ? "300px" : props.rank === 2 ? "260px" : "220px"};
  margin-left: auto;
  margin-right: auto;
  word-wrap: break-word;
`;

const Score = styled.div<{ rank: number }>`
  color: #9fff9c;
  font-weight: bold;
  margin-top: 10px;
  font-size: ${(props) =>
    props.rank === 1 ? "32px" : props.rank === 2 ? "28px" : "24px"};
`;

const ListContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  backdrop-filter: blur(5px);
  width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  font-size: 18px;
`;

interface RankItemProps {
  isLastInColumn?: boolean;
}

const RankItem = styled.div<RankItemProps>`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 18px;

  &:last-child {
    border-bottom: ${(props) =>
      props.isLastInColumn ? "none" : "1px solid rgba(255, 255, 255, 0.1)"};
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
    content: "⭐" .repeat(5);
    color: ${(props) =>
      props.rank === 1 ? "#FFD700" : props.rank === 2 ? "#C0C0C0" : "#CD7F32"};
    font-size: 12px;
  }
`;

const UpdateTime = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: #9fff9c;
  font-size: 14px;
  z-index: 1;
`;

interface ResultsProps {
  results: Record<string, number>;
  totalVotes: number;
}

export default function Results({
  results: initialResults,
  totalVotes: initialTotal,
}: ResultsProps) {
  const [results, setResults] = useState(initialResults);
  const [totalVotes, setTotalVotes] = useState(initialTotal);
  const [lastUpdate, setLastUpdate] = useState<string>(
    new Date().toLocaleTimeString("ko-KR")
  );

  useEffect(() => {
    const fetchNewData = async () => {
      const response = await fetch("/api/results");
      const newData = await response.json();
      setResults(newData.results);
      setTotalVotes(newData.totalVotes);
      setLastUpdate(new Date().toLocaleTimeString("ko-KR"));
    };

    const interval = setInterval(fetchNewData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const sortedResults = Object.entries(results).sort(([, a], [, b]) => b - a);

  const getTopThree = () => {
    if (sortedResults.length === 0) {
      // Return dummy data when no votes exist
      return [
        ["No votes yet", 0],
        ["No votes yet", 0],
        ["No votes yet", 0],
      ];
    }
    const [first, second, third] = sortedResults;
    return [
      second || ["No votes yet", 0],
      first || ["No votes yet", 0],
      third || ["No votes yet", 0],
    ];
  };

  // Create an array of all options with 0 votes for unvoted options
  const allOptions = Object.values(OPTION_NAMES);
  const resultsWithZeros = allOptions
    .map((option) => {
      const votes = results[option] || 0;
      return [option, votes];
    })
    .sort(([, a], [, b]) => (b as number) - (a as number));

  const renderRankItems = (items: [string, number][]) => {
    const itemsPerColumn = Math.ceil(items.length / 3);
    const firstColumn = items.slice(0, itemsPerColumn);
    const secondColumn = items.slice(itemsPerColumn, itemsPerColumn * 2);
    const thirdColumn = items.slice(itemsPerColumn * 2);

    return (
      <>
        <div>
          {firstColumn.map(([option, votes], index) => (
            <RankItem
              key={option}
              isLastInColumn={index === firstColumn.length - 1}
            >
              <div style={{ width: "30px", color: "#9fff9c" }}>{index + 4}</div>
              <div style={{ flex: 1 }}>{option}</div>
              <div style={{ color: "#9fff9c" }}>{votes.toLocaleString()}</div>
            </RankItem>
          ))}
        </div>
        <div>
          {secondColumn.map(([option, votes], index) => (
            <RankItem
              key={option}
              isLastInColumn={index === secondColumn.length - 1}
            >
              <div style={{ width: "30px", color: "#9fff9c" }}>
                {index + 4 + firstColumn.length}
              </div>
              <div style={{ flex: 1 }}>{option}</div>
              <div style={{ color: "#9fff9c" }}>{votes.toLocaleString()}</div>
            </RankItem>
          ))}
        </div>
        <div>
          {thirdColumn.map(([option, votes], index) => (
            <RankItem
              key={option}
              isLastInColumn={index === thirdColumn.length - 1}
            >
              <div style={{ width: "30px", color: "#9fff9c" }}>
                {index + 4 + firstColumn.length + secondColumn.length}
              </div>
              <div style={{ flex: 1 }}>{option}</div>
              <div style={{ color: "#9fff9c" }}>{votes.toLocaleString()}</div>
            </RankItem>
          ))}
        </div>
      </>
    );
  };

  return (
    <ResultContainer>
      <ContentWrapper>
        <UpdateTime>마지막 업데이트: {lastUpdate}</UpdateTime>
        <Title>24년도 ID사업부 기술성과 공유회</Title>
        <TopThree>
          {getTopThree().map(([option, votes], index) => {
            const actualRank = index === 1 ? 1 : index === 0 ? 2 : 3;
            const percentage = (((votes as number) / totalVotes) * 100).toFixed(
              1
            );

            return (
              <RankCircle key={option} rank={actualRank}>
                <Stars rank={actualRank} />
                <RankImage rank={actualRank}>
                  {actualRank === 1 && <Crown>👑</Crown>}
                  <VoteCount rank={actualRank}>
                    {votes.toLocaleString()}표
                  </VoteCount>
                  <VotePercentage rank={actualRank}>
                    {percentage}%
                  </VotePercentage>
                </RankImage>
                <RankInfo rank={actualRank}>
                  <div>{option}</div>
                  <Score rank={actualRank}>{actualRank}등</Score>
                </RankInfo>
              </RankCircle>
            );
          })}
        </TopThree>
        <div style={{ height: "40px" }}></div>
        <ListContainer>
          {renderRankItems(resultsWithZeros.slice(3) as [string, number][])}
        </ListContainer>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link href="/" style={{ color: "#9fff9c", textDecoration: "none" }}>
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
