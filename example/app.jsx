const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "editorial"
}/*EDITMODE-END*/;

function App() {
  const [page, setPage] = React.useState(() => localStorage.getItem("sg_page") || "home");
  const [booking, setBooking] = React.useState(false);
  const [singlePost, setSinglePost] = React.useState(null);
  const [variant, setVariant] = React.useState(TWEAK_DEFAULTS.variant);

  React.useEffect(() => { localStorage.setItem("sg_page", page); window.scrollTo(0, 0); }, [page]);
  React.useEffect(() => { document.body.setAttribute("data-variant", variant); }, [variant]);

  return (
    <>
      <Nav page={page} setPage={setPage} onBook={() => setBooking(true)} />
      {page === "home" && <Home onBook={() => setBooking(true)} setPage={setPage} setSinglePost={setSinglePost} />}
      {page === "blog" && <Blog setPage={setPage} setSinglePost={setSinglePost} />}
      {page === "single" && <BlogSingle post={singlePost} setPage={setPage} setSinglePost={setSinglePost} />}
      {booking && <Booking onClose={() => setBooking(false)} />}
      <Tweaks variant={variant} setVariant={setVariant} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
