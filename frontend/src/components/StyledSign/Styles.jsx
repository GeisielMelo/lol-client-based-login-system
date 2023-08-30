import styled, { css } from "styled-components";
import backgroundImage from "../../images/bg.jpg";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 100vh;

  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  width: 100%;
  height: 100vh;
  max-width: 400px;
  padding: 0 55px;
  background-color: ${(props) => props.theme.color.White.default};
  box-shadow: 0 1px 5px #292828;
  @media (max-width: 600px) {
    max-width: 100%;
    border-radius: 0;
  }
`;

export const Form = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

export const ElementDisabled = css`
  &:disabled {
    background: transparent;
    color: rgb(173, 173, 173);
    cursor: not-allowed;
  }
`;

export const Logo = styled.img`
  width: 110px;
  height: 30px;
  margin: 70px 0px;
`;

export const Title = styled.h1`
  font-family: ${(props) => props.theme.font.family.one};
  font-size: ${(props) => props.theme.font.size.md};
  font-weight: 600;
  margin: 15px 0px;
`;

export const Input = styled.input`
  ${ElementDisabled}
  width: 100%;
  height: 40px;

  padding: 10px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;

  font-family: ${(props) => props.theme.font.family.one};
  font-size: ${(props) => props.theme.font.size.sm};
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: #323238;
  background: #ededed;
  transition: all 0.1s ease-in-out;

  &:focus {
    border: 2px solid #323238;
  }
`;

export const SubmitButton = styled.button`
  ${ElementDisabled}
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 72px;
  height: 72px;
  margin: 15px 0px;
  border-radius: 27px;
  cursor: pointer;

  background: rgb(213, 50, 53);
  color: rgb(252, 252, 252);
  &:disabled {
    border: 2px solid rgba(173, 173, 173, 0.3);
  }
`;

export const ChangePage = styled.button`
  position: fixed;
  bottom: 40px;

  max-width: max-content;
  width: 100%;
  font-family: ${(props) => props.theme.font.family.one};
  font-size: ${(props) => props.theme.font.size.sm};
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: #323238;
  padding-left: 2px;
  background: none;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
  @media (max-width: 600px) {
    position: static;
    padding-top: 20px;
  }
`;
