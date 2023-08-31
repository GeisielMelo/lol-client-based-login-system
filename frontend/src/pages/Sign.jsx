import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { isEmail } from "../utils/FieldsUtils";
import { Loading } from "../components/Loading";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Warning from "../components/Warnings";
import logoImage from "../images/logo.png";
import { Section, Container, Form, Logo, Title } from "../components/StyledSign/Styles";
import { SubmitButton, ChangePage } from "../components/StyledSign/Buttons";
import Input from "../components/StyledSign/Input";

const Sign = () => {
  const navigate = useNavigate();
  const { login, register, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningType, setWarningType] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", lastName: "", email: "", password: "", confirmPassword: "" });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!isRegisterMode) {
      loginForm.email && loginForm.password ? setCanSubmit(true) : setCanSubmit(false);
    } else {
      registerForm.name && registerForm.lastName && registerForm.email && registerForm.password && registerForm.confirmPassword ? setCanSubmit(true) : setCanSubmit(false);
    }
  }, [loginForm, registerForm, isRegisterMode]);

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

  const handleChangePage = () => {
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ name: "", lastName: "", email: "", password: "", confirmPassword: "" });
    setIsRegisterMode(!isRegisterMode);
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginForm;

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
    const { name, lastName, email, password, confirmPassword } = registerForm;

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

  return (
    <Section>
      <Container>
        <Logo src={logoImage} alt="logo" width={200} height={200} />
        <Title>{isRegisterMode ? "Sign up" : "Sign in"}</Title>

        <Form onSubmit={isRegisterMode ? handleSubmitRegister : handleSubmitLogin}>
          {isRegisterMode ? (
            <>
              <Input
                disabled={loading}
                type="text"
                placeholder="Name"
                autoComplete="off"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              />
              <Input
                disabled={loading}
                type="text"
                placeholder="Last Name"
                autoComplete="off"
                value={registerForm.lastName}
                onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
              />
              <Input
                disabled={loading}
                type="email"
                placeholder="E-mail"
                autoComplete="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
              <Input
                disabled={loading}
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
              <Input
                disabled={loading}
                type="password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              />
            </>
          ) : (
            <>
              <Input
                disabled={loading}
                type="email"
                placeholder="E-mail"
                autoComplete="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
              <Input
                disabled={loading}
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </>
          )}

          <SubmitButton disabled={loading || !canSubmit} type="submit">
            {loading ? <Loading /> : <ArrowRightAltIcon />}
          </SubmitButton>
        </Form>

        <ChangePage disabled={loading} onClick={handleChangePage}>
          {isRegisterMode ? "SIGN IN" : "CREATE ACCOUNT"}
        </ChangePage>

        {showWarning && warningMessage && warningType && <Warning message={warningMessage} type={warningType} />}
      </Container>
    </Section>
  );
};

export default Sign;
