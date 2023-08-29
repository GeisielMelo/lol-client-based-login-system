import React, { useRef, useEffect, useContext, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { isEmail } from "../utils/FieldsUtils";
import { Loading } from "../components/Loading";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Warning from "../components/Warnings";
import backgroundImage from "../images/bg.jpg";
import logoImage from "../images/logo.png";

const Section = styled.section`
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

const Container = styled.div`
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

const Form = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const ElementDisabled = css`
  &:disabled {
    background: transparent;
    color: rgb(173, 173, 173);
    border: 2px solid rgba(173, 173, 173, 0.3);
    cursor: not-allowed;
  }
`;

const Logo = styled.img`
  width: 110px;
  height: 30px;
  margin: 70px 0px;
`;

const Title = styled.h1`
  font-family: ${(props) => props.theme.font.family.one};
  font-size: ${(props) => props.theme.font.size.md};
  font-weight: 600;
  margin: 15px 0px;
`;

const Input = styled.input`
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

const SubmitButton = styled.button`
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
`;

const ChangePage = styled.button`
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

const Sign = () => {
  const navigate = useNavigate();
  const { login, register, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
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

    setIsRegisterMode(!isRegisterMode);
    handleInputChange();
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;

    if (!email || !password) {
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

    if (!name || !lastName || !email || !password || !confirmPassword) {
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

  const handleInputChange = () => {
    const formFields = isRegisterMode ? registerForm.current : loginForm.current;

    if (formFields) {
      const inputFields = Array.from(formFields.querySelectorAll("input")).filter((input) => input.type !== "submit" && input.type !== "button" && input.type !== "hidden");

      const areFieldsEmpty = inputFields.some((input) => !input.value);
      setCanSubmit(!areFieldsEmpty);
    }
  };

  return (
    <Section>
      <Container>
        <Logo src={logoImage} alt="logo" width={200} height={200} />
        <Title>{isRegisterMode ? "Sign up" : "Sign in"}</Title>

        <Form onSubmit={isRegisterMode ? handleSubmitRegister : handleSubmitLogin} ref={isRegisterMode ? registerForm : loginForm}>
          {isRegisterMode ? (
            <>
              <Input disabled={loading} type="text" name="name" placeholder="Name" autoComplete="off" onChange={handleInputChange} />
              <Input disabled={loading} type="text" name="lastName" placeholder="Last Name" autoComplete="off" onChange={handleInputChange} />
              <Input disabled={loading} type="email" name="email" placeholder="E-mail" autoComplete="email" onChange={handleInputChange} />
              <Input disabled={loading} type="password" name="password" placeholder="Password" autoComplete="new-password" onChange={handleInputChange} />
              <Input disabled={loading} type="password" name="confirmPassword" placeholder="Confirm Password" autoComplete="new-password" onChange={handleInputChange} />
            </>
          ) : (
            <>
              <Input disabled={loading} type="email" name="email" placeholder="E-mail" autoComplete="email" onChange={handleInputChange} />
              <Input disabled={loading} type="password" name="password" placeholder="Password" autoComplete="current-password" onChange={handleInputChange} />
            </>
          )}

          <SubmitButton disabled={loading || !canSubmit} type="submit">
            {loading ? <Loading /> : <ArrowRightAltIcon />}
          </SubmitButton>
        </Form>

        <ChangePage disabled={loading} onClick={handleResetFields}>
          {isRegisterMode ? "SIGN IN" : "CREATE ACCOUNT"}
        </ChangePage>

        {showWarning && warningMessage && warningType && <Warning message={warningMessage} type={warningType} />}
      </Container>
    </Section>
  );
};

export default Sign;
