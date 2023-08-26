import React from "react";
import styled from "styled-components";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Index = () => {
  return (
    <Section>
      <h1>Hello World</h1>
    </Section>
  );
};

export default Index;