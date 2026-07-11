const { useState: useNavState } = React;

function Nav({ page, setPage, onBook }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="nav-logo" href="#" onClick={(e) => { e.preventDefault(); setPage("home"); }}>
          <img src="assets/logo.webp" alt="Studio Glimlach" />
        </a>
        <div className="nav-links">
          <button className={"nav-link " + (page === "home" ? "active" : "")} onClick={() => setPage("home")}>Home</button>
          <button className={"nav-link hide-sm " + (page === "home" ? "" : "")} onClick={() => { setPage("home"); setTimeout(() => document.getElementById("over")?.scrollIntoView({ behavior: "smooth" }), 50); }}>Over ons</button>
          <button className={"nav-link hide-sm"} onClick={() => { setPage("home"); setTimeout(() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" }), 50); }}>Portfolio</button>
          <button className={"nav-link " + (page === "blog" || page === "single" ? "active" : "")} onClick={() => setPage("blog")}>Blog</button>
          <button className="btn" style={{ padding: "10px 18px", fontSize: 11 }} onClick={onBook}>Plan afspraak</button>
        </div>
      </div>
    </nav>
  );
}

window.Nav = Nav;
