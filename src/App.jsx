import { useEffect, useState } from "react";
import { Octokit } from "octokit";
import Pagination from "./components/Pagination";
import imgicn from "./gitiocon.png";
import github from "./githubicon.png";
import "./App.css";

function App() {
  const [data, setdata] = useState([]);
  const [searchdata, setsearchdata] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [flag, setflag] = useState(true);
  const [err, seterr] = useState("");
  const [postsPerPage] = useState(5);

  const dataHandler = async () => {
    const octokit = new Octokit({
      auth: "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",
    });
    let fetch = await octokit.request(
      "GET /repos/microservices-demo/microservices-demo/issues",
      {
        owner: "microservices-demo",
        repo: "microservices-demo",
      }
    );
    let newdata = fetch.data.filter((ele) => ele.state === "open");
    setdata(newdata);
  };
  // console.log(data);

  useEffect(() => {
    dataHandler();
  }, [flag]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setsearchdata(e.target.value);
    // console.log(searchdata);
  };

  const handleclick = () => {
    let newarr = data.filter((ele) =>
      ele.title.toLowerCase().includes(searchdata.toLowerCase())
    );
    // console.log(newarr);
    if (newarr.length != 0) {
      setdata(newarr);
      seterr("");
    } else {
      setflag(!flag);
      seterr("No Search Result Found");
    }
  };

  return (
    <div>
      <div className="head">
        <img src={github} className="img" />
        <h1>GitHub</h1>
      </div>
      <div className="custom-width">
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            Filter
          </span>

          <input
            type="text"
            className="form-control "
            placeholder="Search Issues"
            aria-label="Search Issues"
            aria-describedby="basic-addon1"
            onChange={handleSearch}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={handleclick}
            style={{ marginRight: "40px" }}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button type="button" className="btn btn-success">
            New Issue
          </button>
        </div>
      </div>

      <label className="label">
        <b>{err}</b>
      </label>

      <ul
        className="list-group mb-3"
        style={{ marginLeft: "20px", marginRight: "20px" }}
      >
        <li className="list-group-item">
          <img src={imgicn} style={{ height: "13px", width: "13px" }} />
          <span> {data.length} Open</span>
        </li>
        {currentPosts.map((ele) => (
          <li className="list-group-item" key={ele.number}>
            <img src={imgicn} style={{ height: "13px", width: "13px" }} />

            <b>
              <a href={ele.html_url} target="blank">
                {" "}
                {ele.title}
              </a>
            </b>

            <p>
              #{ele.number} opened by {ele.user.login}
            </p>
          </li>
        ))}
      </ul>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={data.length}
        paginate={paginate}
      />
    </div>
  );
}

export default App;
