import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  height: 100vh;
`;
const Wrapper = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
`;

const Logo = styled.img`
  width: 300px;
`;

const Title = styled.h1`
  margin-top: 20px;
  font-size: 32px;
`;

const InputContainer = styled.div`
  margin-top: 100px;
  display: flex;
`;

const Input = styled.input`
  width: 500px;
  padding: 15px;
  font-size: 18px;
  border: 1px solid #e2e2e2;
  &:focus {
    outline: none;
    border: 1px solid #ff812c;
  }
`;

const Button = styled.button`
  padding: 10px;
  width: 100px;
  cursor: pointer;
  border: none;
  background-color: #ff812c;
  color: white;
  font-weight: bold;
`;

function App() {
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const handleChange = (e) => {
    setName(e.target.value);
  };
  const handleClick = () => {
    navigate("/report", { state: { name } });
  };
  return (
    <Container>
      <Wrapper>
        <Logo src="./assets/logo.png" />
        <Title>긍정 피드백 리포트</Title>
        <InputContainer>
          <Input
            type="text"
            placeholder="이름을 입력하세요"
            onChange={handleChange}
          />
          <Button onClick={handleClick}>리포트 생성</Button>
        </InputContainer>
      </Wrapper>
    </Container>
  );
}

export default App;
