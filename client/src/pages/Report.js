import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import ReactLoading from "react-loading";
import { getData } from "../api";
import { RESULT } from "../db";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const COLORS = [
  "#CC2B69",
  "#ED2B2B",
  "#FF812C",
  "#FFC842",
  "#DAE233",
  "#00C0E0",
  "#7CA1D3",
  "#B782B9",
];

const Container = styled.div`
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${(props) => (props.isLoading ? "100vh" : "auto")};
`;
const Wrapper = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

const HeaderTopContainer = styled.div`
  display: flex;
`;
const HeaderTopBorder = styled.div`
  height: 10px;
  width: 12.5%;
  background-color: ${(props) => props.bgColor};
`;
const Header = styled.div`
  width: 100%;
  height: 80px;
  background-color: #ff812c;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const HeaderText = styled.span`
  color: white;
  font-size: 32px;
  font-weight: bold;
  margin-left: 20px;
`;

const SectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  margin-top: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff812c;
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 10px 0;
`;

const SectionSubTitle = styled.div`
  font-size: 18px;
  //   margin-left: 40px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const SectionTopWords = styled.div`
  background-color: #f3f3f3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 20px 0;
`;

const TopWords = styled.span`
  font-size: 18px;
  margin: 10px;
`;

const SectionAllWords = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #f3f3f3;
  padding: 20px 10px;
`;

const AllWords = styled.span`
  font-size: 14px;
  margin: 0 5px;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const CommentSection = styled.div`
  display: flex;
  margin: 10px 0;
`;

const CommentSectionTitle = styled.div`
  background-color: #ff812c;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 100px;
  margin-right: 10px;
`;

const CommentSectionList = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f3f3f3;
  width: 100%;
  padding: 5px 10px;
`;

const CommentSectionItem = styled.p``;

const DownloadButton = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  position: fixed;
  bottom: 50px;
  right: 50px;
  cursor: pointer;
`;

function Report() {
  const [strengthWords, setStrengthWords] = useState([]);
  const [valueWords, setValueWords] = useState([]);
  const [appreciateComments, setAppreciateComments] = useState([]);
  const [expectComments, setExpectComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const printRef = useRef();

  const location = useLocation();
  console.log(location.state.name);
  useEffect(() => {

    // Dummy Data
    const result = RESULT;
    setStrengthWords(result.strengthWords);
    setValueWords(result.valueWords);
    setAppreciateComments(result.appreciateComments);
    setExpectComments(result.expectComments);

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 2000);

    // API Data
    // getData(location.state.name).then((result) => {
    //   console.log(result);
    //   setStrengthWords(result.strengthWords);
    //   setValueWords(result.valueWords);
    //   setAppreciateComments(result.appreciateComments);
    //   setExpectComments(result.expectComments);
    // });
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 1,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("print.pdf");
  };

  return (
    <Container isLoading={isLoading}>
      {isLoading ? (
        <>
          <ReactLoading
            type={"bars"}
            color={"black"}
            height={"100px"}
            width={"100px"}
          />
          <span>리포트 생성중...</span>
        </>
      ) : (
        <Wrapper ref={printRef}>
          <HeaderTopContainer>
            {COLORS.map((color) => (
              <HeaderTopBorder bgColor={color} />
            ))}
          </HeaderTopContainer>
          <Header>
            <HeaderText>긍정 피드백</HeaderText>
          </Header>
          <SectionContainer>
            <Section>
              <SectionHeader>구성원들이 보는 나의 강점</SectionHeader>
              <SectionSubTitle>TOP 3</SectionSubTitle>
              <SectionTopWords>
                {strengthWords.slice(0, 3).map((word, index) => (
                  <TopWords key={index}>{word[0]}</TopWords>
                ))}
              </SectionTopWords>
              <SectionSubTitle>강점 단어 모음</SectionSubTitle>
              <SectionAllWords>
                {strengthWords.map((word, index) => (
                  <AllWords key={index}>{`${word[0]} (${word[1]})`}</AllWords>
                ))}
              </SectionAllWords>
            </Section>
            <Section>
              <SectionHeader>구성원들이 보는 나의 가치</SectionHeader>
              <SectionSubTitle>TOP 3</SectionSubTitle>
              <SectionTopWords>
                {valueWords.slice(0, 3).map((word, index) => (
                  <TopWords key={index}>{word[0]}</TopWords>
                ))}
              </SectionTopWords>
              <SectionSubTitle>가치 단어 모음</SectionSubTitle>
              <SectionAllWords>
                {valueWords.map((word, index) => (
                  <AllWords key={index}>{`${word[0]} (${word[1]})`}</AllWords>
                ))}
              </SectionAllWords>
            </Section>
          </SectionContainer>
          <CommentContainer>
            <CommentSection>
              {/* <CommentSectionTitle>감사와<br />응원을<br />보냅니다</CommentSectionTitle> */}
              <CommentSectionTitle><span>감사와</span><span>응원을</span><span>보냅니다</span></CommentSectionTitle>
              <CommentSectionList>
                {appreciateComments.map((comment, index) => (
                  <CommentSectionItem key={index}>
                    - {comment}
                  </CommentSectionItem>
                ))}
              </CommentSectionList>
            </CommentSection>
            <CommentSection>
              <CommentSectionTitle><span>앞으로</span><span>기대합니다</span></CommentSectionTitle>
              <CommentSectionList>
                {expectComments.map((comment, index) => (
                  <CommentSectionItem key={index}>
                    - {comment}
                  </CommentSectionItem>
                ))}
              </CommentSectionList>
            </CommentSection>
          </CommentContainer>
        </Wrapper>
      )}
      <DownloadButton onClick={handleDownloadPdf}>PDF</DownloadButton>
    </Container>
  );
}

export default Report;
