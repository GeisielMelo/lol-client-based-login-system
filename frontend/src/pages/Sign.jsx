import React, { useRef, useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { isEmpty, isEmail } from "../utils/FieldsUtils";
import { Loading } from "../components/Loading";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Warning from "../components/Warnings";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;
  height: 100%;
  max-height: 420px;
  max-width: 320px;

  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.color.White.default};
  box-shadow: 0 1px 5px #292828;
  @media (max-width: 600px) {
    max-height: 100%;
    max-width: 100%;
    border-radius: 0;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px;
`;

const Title = styled.h1`
  font-family: ${(props) => props.theme.font.family.one};
  font-size: ${(props) => props.theme.font.size.sm};
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  margin: 10px 0px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;

  padding: 10px;
  margin: 5px 0;
  border: 1px solid ${(props) => props.theme.color.Slate.default};
  border-radius: 4px;

  font-family: ${(props) => props.theme.font.family.two};
  font-size: ${(props) => props.theme.font.size.sm};
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: #323238;
`;

const Button = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 80px;
  height: 30px;
  cursor: pointer;

  background-color: ${(props) => props.theme.color.Navy.default};
  border-radius: 4px;
  color: ${(props) => props.theme.color.White.default};
  border: none;

  font-family: ${(props) => props.theme.font.family.two};
  font-size: ${(props) => props.theme.font.size.sm};
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ChangePage = styled.p`
  max-width: max-content;
  width: 100%;
  font-family: ${(props) => props.theme.font.family.two};
  font-size: ${(props) => props.theme.font.size.sm};
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: #323238;
  padding-left: 2px;
  cursor: pointer;
`;

const Sign = () => {
  const navigate = useNavigate();
  const { login, register, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningType, setWarningType] = useState("");

  const loginForm = useRef(null);
  const registerForm = useRef(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleShowWarning = (message, type) => {
    if (!showWarning) {
      setWarningMessage(message);
      setWarningType(type);
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
        setWarningMessage("");
      }, 2000);
    }
  };

  const handleResetFields = () => {
    if (loginForm.current) {
      loginForm.current.reset();
    }
    if (registerForm.current) {
      registerForm.current.reset();
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;

    if (isEmpty([email, password])) {
      return handleShowWarning("Invalid email or password", "error");
    }

    if (!isEmail(email)) {
      return handleShowWarning("invalid email", "error");
    }

    try {
      setLoading(true);
      await login(email, password);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401) {
        return handleShowWarning("Invalid email or password.", "warning");
      } else {
        return handleShowWarning("something went wrong", "error");
      }
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const name = registerForm.current.name.value;
    const lastName = registerForm.current.lastName.value;
    const email = registerForm.current.email.value;
    const password = registerForm.current.password.value;
    const confirmPassword = registerForm.current.confirmPassword.value;

    if (isEmpty([name, lastName, email, password, confirmPassword])) {
      return handleShowWarning("fill all fields", "warning");
    }

    if (password !== confirmPassword) {
      return handleShowWarning("passwords don't match", "error");
    }

    if (!isEmail(email)) {
      return handleShowWarning("invalid email", "error");
    }

    try {
      setLoading(true);
      await register(name, lastName, email, password);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response?.status === 409) {
        return handleShowWarning("Email already in use", "warning");
      } else {
        return handleShowWarning("Something went wrong", "error");
      }
    }
  };

  return (
    <Section>
      <Container>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Title>{isRegisterMode ? "Register" : "Login"}</Title>
            <form onSubmit={isRegisterMode ? handleSubmitRegister : handleSubmitLogin} ref={isRegisterMode ? registerForm : loginForm}>
              {isRegisterMode ? (
                <>
                  <Input type="text" name="name" placeholder="Name" />
                  <Input type="text" name="lastName" placeholder="Last Name" />
                  <Input type="email" name="email" placeholder="E-mail" />
                  <Input type="password" name="password" placeholder="Password" />
                  <Input type="password" name="confirmPassword" placeholder="Confirm Password" />
                </>
              ) : (
                <>
                  <Input type="email" name="email" placeholder="E-mail" />
                  <Input type="password" name="password" placeholder="Password" />
                </>
              )}

              <ButtonsContainer>
                <ChangePage
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    handleResetFields();
                  }}
                >
                  {isRegisterMode ? "Already registered?" : "Not registered yet?"}
                </ChangePage>

                <Button type="submit">
                  <ArrowRightAltIcon />
                </Button>
              </ButtonsContainer>
            </form>
            {showWarning && warningMessage && warningType && <Warning message={warningMessage} type={warningType} />}
          </>
        )}
      </Container>
    </Section>
  );
};

export default Sign;
