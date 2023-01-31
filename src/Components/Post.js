import { useEffect, useState } from "react";
import axios from "axios";

function Post() {
  const [gifData, setGifData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [gifActive, setGifActive] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGif, setSelectedGif] = useState("");
  const [postDetail, setPostDetail] = useState("");
  const giphyAPI = process.env.REACT_APP_GIPHY_KEY;

  const fetchPosts = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://6268e626aa65b5d23e7c270b.mockapi.io/posts`
      );
      console.log(res);
      setPostData(res.data);
    } catch (error) {
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const res = await axios.get(`https://api.giphy.com/v1/gifs/trending`, {
          params: { api_key: giphyAPI },
        });
        setGifData(res.data.data);
        console.log(res);
      } catch (error) {
        setIsError(true);
        setTimeout(() => setIsError(false), 4000);
      }
      setIsLoading(false);
    };

    fetchData();
    fetchPosts();
  }, []);

  const renderGifs = () => {
    if (isLoading) {
      return <div class="loader">Loading...</div>;
    }
    return gifData.map((e, i) => {
      return (
        <div key={e.id} className="gif">
          <img
            onClick={() => handleSelection(e.id)}
            src={e.images.fixed_height.url}
          />
        </div>
      );
    });
  };

  const renderError = () => {
    if (isError) {
      return (
        <div class="alert alert-warning" role="alert">
          Unable to get GIFs, please try again!
        </div>
      );
    }
  };
  const handleSelection = async (e) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const res = await axios.get(`https://api.giphy.com/v1/gifs/${e}`, {
        params: { api_key: giphyAPI },
      });
      setSelectedGif(res.data.data.images.fixed_height.url);
      console.log(res);
    } catch (error) {
      console.log(error);
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }
    setIsLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setIsLoading(true);
    try {
      const res = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
        params: { api_key: giphyAPI, q: search },
      });
      setGifData(res.data.data);
      console.log(res);
    } catch (error) {
      console.log(error);
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }
    setIsLoading(false);
  };

  const handleGif = () => {
    setGifActive(!gifActive);
  };

  const handleReset = () => {
    setSelectedGif("");
  };

  const handlePostDetails = (e) => {
    setPostDetail(e.target.value);
  };

  const handleAddPost = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const Post = {
        postdesc: postDetail,
        gifurl: selectedGif,
      };
      const res = await axios.post(
        `https://6268e626aa65b5d23e7c270b.mockapi.io/posts/`,
        Post
      );
    } catch (error) {
      console.log(error);
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }
    setIsLoading(false);
    setPostDetail("")
    setSelectedGif("");
    window.location.reload()
    fetchPosts();
  };

  const handleDelete = async (e) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const Post = {
        postdesc: postDetail,
        gifurl: selectedGif,
      };
      const res = await axios.delete(
        `https://6268e626aa65b5d23e7c270b.mockapi.io/posts/${e.id}`,
        Post
      );
    } catch (error) {
      console.log(error);
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }
    setIsLoading(false);
    fetchPosts();
  };
  return (
    <div className="App">
      <div
        className="heading justify-content-center"
        style={{ display: "flex" }}
      >
        <h3 className="mt-3" style={{ color: "#3e92cc" }}>
          Facebook Add Post with GIF
        </h3>
      </div>
      <div className="container-fluid mt-3" style={{ display: "flex" }}>
        <div className="row" style={{width:"100%"}}>
          <div className="col-12 col-md-4 col-lg-4">
            <button
              type="button"
              class=" addbtn"
              data-toggle="modal"
              data-target="#exampleModalCenter"
            >
              Add Post
            </button>
          </div>
          <div className="col-12 mt-5">
            <div className="container">
              <div className="row">
                {postData
                  ? postData.map((e, i) => (
                      <div key={e.id} className="col-12 col-md-4 col-lg-4">
                        <div
                          class="card"
                          style={{ width: "18rem", background: "#b8dbd9" }}
                        >
                          <img
                            class="card-img-top"
                            src={e.gifurl}
                            alt="Card image cap"
                            style={{maxHeight:"230px"}}
                          />
                          <div class="card-body">
                            <h5 class="card-title">Caption</h5>
                            <p class="card-text">{e.postdesc}</p>
                            <a
                              onClick={() => handleDelete(e)}
                              href="#"
                              class="btn btn-danger"
                            >
                              Delete Post
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  : "hi"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalCenterTitle">
                Add Post
              </h5>
              <button
                type="button"
                class="closebtn"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">X</span>
              </button>
            </div>
            <div class="modal-body">
              <div className="row">
                <div className="col">
                  <div class="input-group">
                    <textarea
                      class="form-control"
                      placeholder="Write Something Here"
                      aria-label="With textarea"
                      value={postDetail}
                      onChange={handlePostDetails}
                    ></textarea>
                  </div>

                  <div>
                    <button onClick={handleGif} className="gif_btn">
                      {" "}
                      <img src="/img/gif.png" alt="gif-icon" /> Add GIF
                    </button>
                  </div>
                  <div
                    className={
                      gifActive ? "gif_container_active" : "gif_container"
                    }
                  >
                    <div className="gif_Search">
                      <form className="form-inline justify-content-center m-2">
                        <input
                          value={search}
                          onChange={handleSearch}
                          type="text"
                          placeholder="Search GIFs"
                          className="form-control"
                        />
                        <button
                          onClick={handleSubmit}
                          type="submit"
                          className="btn btn-primary mx-2"
                        >
                          Go
                        </button>
                      </form>
                    </div>
                    <div className="gif_Results">
                      <div className="m-2">
                        {renderError()}
                        <div className="container gifs">
                          {selectedGif ? (
                            <>
                              <img src={selectedGif} />
                            </>
                          ) : (
                            renderGifs()
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleReset}
              >
                Discard
              </button>
              <button
                onClick={handleAddPost}
                type="button"
                class="btn btn-primary"
              >
                Upload Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
