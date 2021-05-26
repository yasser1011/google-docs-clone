import TextEditor from "./components/TextEditor/TextEditor";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Error from "./components/Error";
import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Redirect to={`/documents/${uuidV4()}`} />
          </Route>
          <Route path="/documents/:documentId" exact component={TextEditor} />
          <Route path="*" component={Error} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
