import { useEffect, useRef, useState } from "react";

let apiPromise;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve(window.YT);
    };
    let script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("error", reject, { once: true });
    window.setTimeout(() => reject(new Error("YouTube player did not load")), 12000);
  }).catch((error) => {
    apiPromise = null;
    throw error;
  });
  return apiPromise;
}

export default function YouTubePlayer({ videoId, title, watchUrl }) {
  const targetRef = useRef(null);
  const playerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setUnavailable(false);
    loadYouTubeApi()
      .then((YT) => {
        if (!mounted || !targetRef.current) return;
        playerRef.current = new YT.Player(targetRef.current, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            origin: window.location.origin,
            enablejsapi: 1,
            rel: 0,
          },
          events: {
            onReady: () => mounted && setLoading(false),
            onError: () => mounted && setUnavailable(true),
          },
        });
      })
      .catch(() => {
        if (mounted) {
          setLoading(false);
          setUnavailable(true);
        }
      });

    return () => {
      mounted = false;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId]);

  return (
    <>
      <div className="youtube-player-target" ref={targetRef} title={title} />
      {loading && !unavailable ? <p className="youtube-player-loading" role="status">Loading video player…</p> : null}
      {unavailable ? (
        <div className="youtube-player-fallback" role="status">
          <p>This video cannot play in the embedded player. Open it on YouTube to watch.</p>
          <a className="btn btn--primary btn--sm" href={watchUrl} target="_blank" rel="noreferrer">
            Watch on YouTube
          </a>
        </div>
      ) : null}
    </>
  );
}
