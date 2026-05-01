import studioRockyLogo from "@/assets/studio-rocky-logo.png";

const DesignCredit = () => {
  return (
    <div className="w-full flex justify-center mt-10 mb-6 px-4">
      <a
        href="https://www.studiorocky.co/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
        style={{
          backgroundColor: "#F5E6D3",
          color: "#19363B",
          fontFamily: '"Josefin Sans", sans-serif',
          fontWeight: 400,
          fontSize: "11px",
          letterSpacing: "0.02em",
          padding: "5px 12px",
          lineHeight: 1,
        }}
      >
        <span>Design thanks to Carey, who you can meet at the event</span>
        <img
          src={studioRockyLogo}
          alt="Studio Rocky"
          style={{ height: "14px", width: "auto", display: "block" }}
        />
      </a>
    </div>
  );
};

export default DesignCredit;
