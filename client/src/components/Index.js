import { Container } from "@material-ui/core";
import Players from "./Players.js";
import Nav from "./Nav.js";

function Index() {
  return (
    <div>
      <Container>
        <Nav />
        <Players />
      </Container>
    </div>
  );
}

export default Index;
