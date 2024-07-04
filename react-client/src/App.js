import CreatePost from "./comps/CreatePost";
import ListPosts from "./comps/ListPosts";

function App() {
  return (
    <div className="container">      
      <CreatePost></CreatePost>
      <hr></hr>
      <ListPosts></ListPosts>
    </div>
  );
}

export default App;
