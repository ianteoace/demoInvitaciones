"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ImageCarousel from "@/components/ImageCarousel";
import MusicPlayer, { type MusicPlayerHandle } from "@/components/MusicPlayer";
import Reveal from "@/components/Reveal";

type TimeLeft = {
  days: string;
  hours: string;
  minutes: string;
};

type FormState = {
  fullName: string;
  attending: "Sí" | "No";
  dietaryRestrictions: string;
  comment: string;
};

const EVENT_DATE = new Date("2026-11-15T00:00:00-03:00");
const EVENT_LOCATION_URL = "#";
const GOOGLE_SCRIPT_URL = "";
const IS_DEMO_MODE = true;
const SPOTIFY_PLAYLIST_URL = "#";

const initialFormState: FormState = {
  fullName: "",
  attending: "Sí",
  dietaryRestrictions: "",
  comment: "",
};

const galleryImages = [
  {
    src: "/gallery/demo-pareja.jpg",
    alt: "Foto editorial de Sofía y Mateo",
    width: 600,
    height: 900,
  },
  {
    src: "/gallery/demo-mesa.jpg",
    alt: "Mesa de boda con velas y flores blancas",
    width: 736,
    height: 1104,
  },
  {
    src: "/gallery/demo-copas.jpeg",
    alt: "Copas grabadas para el brindis",
    width: 365,
    height: 547,
  },
  {
    src: "/gallery/demo-anillos.jpeg",
    alt: "Anillos sobre madera con flores suaves",
    width: 678,
    height: 452,
  },
  {
    src: "/gallery/demo-ramo.jpeg",
    alt: "Ramo en tonos nude y blanco",
    width: 638,
    height: 480,
  },
  {
    src: "/gallery/demo-salon.jpeg",
    alt: "Salón de boda con arcos de piedra y araña central",
    width: 494,
    height: 404,
  },
];

function getInitialCountdown(): TimeLeft {
  return {
    days: "00",
    hours: "00",
    minutes: "00",
  };
}

function getTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - Date.now();
  const safeDifference = Math.max(0, difference);

  const days = Math.floor(safeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeDifference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((safeDifference / (1000 * 60)) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
  };
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-blush-deep)] sm:text-xs sm:tracking-[0.34em]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-4 font-serif-display text-3xl tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-[color:rgba(74,46,42,0.76)] sm:text-base">
        {description}
      </p>
    </div>
  );
}

function SectionOrnament() {
  return (
    <div className="mt-6 flex items-center justify-center gap-3 text-[var(--color-champagne)] sm:mt-8">
      <span className="h-px w-10 bg-[rgba(217,181,109,0.45)] sm:w-12" />
      <span className="text-sm">✦</span>
      <span className="h-px w-10 bg-[rgba(217,181,109,0.45)] sm:w-12" />
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center px-5 sm:px-8 lg:px-12">
      <div className="flex w-full max-w-4xl items-center justify-center gap-3 text-[var(--color-champagne)]">
        <span className="h-px flex-1 bg-[rgba(217,181,109,0.28)]" />
        <span className="text-xs text-[rgba(201,138,148,0.72)]">✦</span>
        <span className="h-px flex-1 bg-[rgba(217,181,109,0.28)]" />
      </div>
    </div>
  );
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getInitialCountdown);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [showGiftDetails, setShowGiftDetails] = useState(false);
  const musicPlayerRef = useRef<MusicPlayerHandle | null>(null);
  const countdownItems = [
    { label: "DÍAS", value: timeLeft.days },
    { label: "HORAS", value: timeLeft.hours },
    { label: "MINUTOS", value: timeLeft.minutes },
  ];

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.hash === "#invitacion") {
      window.history.replaceState(null, "", window.location.pathname);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const animationFrameId = window.requestAnimationFrame(() => {
      setTimeLeft(getTimeLeft(EVENT_DATE));
    });

    const intervalId = window.setInterval(() => {
      setTimeLeft(getTimeLeft(EVENT_DATE));
    }, 1000);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearInterval(intervalId);

      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fullName = formState.fullName.trim();
    const attendance = formState.attending;

    if (!fullName || !attendance) {
      setSuccess(false);
      setError(true);
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);
    setError(false);

    try {
      if (IS_DEMO_MODE || !GOOGLE_SCRIPT_URL) {
        await new Promise((resolve) => window.setTimeout(resolve, 500));
        setSuccess(true);
        setError(false);
        setFormState(initialFormState);
        return;
      }

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          fullName,
          attendance,
          dietaryRestrictions: formState.dietaryRestrictions,
          comment: formState.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSuccess(true);
      setError(false);
      setFormState(initialFormState);
    } catch {
      setSuccess(false);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleViewInvitationClick() {
    await musicPlayerRef.current?.play();
    document
      .getElementById("invitacion")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#DDCBB0] text-[var(--color-ink)]">
      <MusicPlayer ref={musicPlayerRef} />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(234,216,197,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(234,216,197,0.22)_1px,transparent_1px),radial-gradient(circle_at_top,rgba(201,138,148,0.16),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(217,181,109,0.14),transparent_24%),radial-gradient(circle_at_50%_55%,rgba(234,216,197,0.28),transparent_34%),radial-gradient(circle_at_12%_82%,rgba(201,138,148,0.10),transparent_24%)] bg-[length:30px_30px,30px_30px,auto,auto,auto,auto]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-white/30 to-transparent" />
      <div className="pointer-events-none absolute left-[-6rem] top-32 -z-10 h-72 w-72 rounded-full bg-[rgba(201,138,148,0.10)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-5rem] top-[28rem] -z-10 h-72 w-72 rounded-full bg-[rgba(217,181,109,0.10)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[10rem] left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[rgba(234,216,197,0.24)] blur-3xl" />

      <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-8 lg:px-8">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[rgba(255,253,248,0.84)] shadow-[0_24px_70px_rgba(93,63,59,0.08)] backdrop-blur-xl sm:rounded-[2rem] lg:rounded-[3rem]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,253,248,0.08))]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/35 to-transparent" />

          <section className="relative overflow-hidden px-4 py-14 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <div className="absolute inset-0">
              <img
                src="/hero/pareja.jpg"
                alt="Sofía y Mateo"
                className="h-full w-full object-cover object-[58%_center] sm:object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,241,0.10),rgba(255,248,241,0.34)_35%,rgba(255,248,241,0.62)_65%,rgba(255,248,241,0.82))]" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[620px] max-w-3xl flex-col items-center justify-center sm:min-h-[70svh]">
              <div className="text-center">
                <h1 className="mt-3 font-serif-display text-5xl leading-none tracking-[-0.04em] text-[var(--color-ink)] sm:mt-4 sm:text-7xl lg:text-8xl">
                  Sofía <span className="text-[0.72em]">&amp;</span> Mateo
                </h1>
                <p className="mt-4 text-xs font-semibold tracking-[0.24em] text-[var(--color-ink)] sm:mt-5 sm:text-base sm:tracking-[0.32em]">
                  15 · 11 · 2026
                </p>
                <p className="mx-auto mt-6 max-w-[20rem] whitespace-pre-line font-verse text-[15px] leading-6 text-[color:rgba(74,46,42,0.82)] sm:mt-8 sm:max-w-4xl sm:text-lg sm:leading-8">
                  {"Cantares 8:7\n¡No hay mares que puedan apagarlo, ni ríos que puedan extinguirlo!\nSi alguien se atreviera a ofrecer todas sus riquezas a cambio del amor, no recibiría más que desprecio"}
                </p>

                <button
                  type="button"
                  onClick={handleViewInvitationClick}
                  className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-blush-deep)] px-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-cream)] shadow-[0_16px_34px_rgba(159,95,104,0.18)] transition hover:-translate-y-0.5 hover:bg-[color:rgba(159,95,104,0.92)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-champagne)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)] sm:mt-10 sm:min-h-14 sm:px-8 sm:text-sm sm:tracking-[0.18em]"
                >
                  Ver invitación
                </button>

              </div>
            </div>
          </section>

          <SectionDivider />

          <div id="invitacion" className="relative">
            <Reveal>
              <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
                <div className="mx-auto max-w-3xl text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C98A94] sm:text-xs sm:tracking-[0.34em]">
                    Cuenta regresiva
                  </p>
                </div>

                <div className="mx-auto mt-8 flex max-w-6xl items-center justify-center sm:mt-10">
                  <div className="flex w-full items-center justify-center gap-1 sm:gap-6 lg:gap-8">
                    {countdownItems.map((item, index) => (
                      <Reveal key={item.label} delay={120 + index * 80}>
                        <div className="flex min-w-0 flex-1 items-center justify-center">
                          <div className="flex min-w-0 flex-col items-center px-2 py-2 text-center sm:px-10 lg:px-12">
                            <p className="font-serif-display text-3xl leading-none tracking-[-0.04em] text-[#4A2E2A] sm:text-5xl lg:text-6xl">
                              {item.value}
                            </p>
                            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[color:rgba(74,46,42,0.58)] sm:mt-3 sm:text-[11px] sm:tracking-[0.32em]">
                              {item.label}
                            </p>
                          </div>

                          {index < countdownItems.length - 1 ? (
                            <div
                              aria-hidden="true"
                              className="mx-1 h-12 w-px shrink-0 bg-[linear-gradient(180deg,rgba(217,181,109,0),rgba(217,181,109,0.7),rgba(234,216,197,0.95),rgba(217,181,109,0.7),rgba(217,181,109,0))] sm:mx-5 sm:h-16 lg:mx-7"
                            />
                          ) : null}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>
  
                <Reveal>
                  <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
                <div className="mx-auto grid max-w-6xl gap-5 md:gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
                  <div className="flex h-full flex-col justify-center rounded-[1.5rem] border border-[rgba(234,216,197,0.48)] bg-[rgba(255,255,255,0.28)] px-5 py-8 text-center shadow-[0_18px_44px_rgba(93,63,59,0.05)] backdrop-blur-md sm:rounded-[2rem] sm:px-8 sm:py-12">
                    <div className="flex h-16 items-center justify-center sm:h-20">
                      <img
                        src="/icons/cruz-de-la-iglesia.png"
                        alt="Ícono de iglesia"
                        className="mx-auto -translate-y-2 h-14 w-14 object-contain brightness-[0.35] contrast-125 sm:h-16 sm:w-16"
                      />
                    </div>
                    <h2 className="mt-3 font-serif-display text-3xl tracking-tight text-[var(--color-ink)] sm:mt-4 sm:text-5xl">
                      Ceremonia
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[color:rgba(74,46,42,0.76)] sm:text-base">
                      La ceremonia será el domingo 15 de noviembre de 2026 a las 12:00 hs
                    </p>
                    <div className="mt-8 hidden lg:flex items-center justify-center gap-3 text-[var(--color-champagne)]">
                      <span className="h-px w-12 bg-[rgba(217,181,109,0.45)]" />
                      <span className="text-sm">✦</span>
                      <span className="h-px w-12 bg-[rgba(217,181,109,0.45)]" />
                    </div>
                  </div>

                  <div className="flex h-full flex-col justify-center rounded-[1.5rem] border border-[rgba(234,216,197,0.48)] bg-[rgba(255,255,255,0.36)] px-5 py-8 text-center shadow-[0_18px_44px_rgba(93,63,59,0.05)] backdrop-blur-md sm:rounded-[2rem] sm:px-8 sm:py-12">
                    <div className="flex h-16 items-center justify-center sm:h-20">
                      <img
                        src="/icons/mapa.png"
                        alt="Ícono de mapa"
                        className="mx-auto h-14 w-14 object-contain sm:h-16 sm:w-16"
                      />
                    </div>
                    <a
                      href={EVENT_LOCATION_URL}
                      className="mt-5 inline-flex min-h-12 items-center justify-center self-center rounded-full border border-[rgba(217,181,109,0.34)] bg-white/28 px-5 text-sm font-medium text-[var(--color-ink)] transition hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-champagne)] sm:mt-6 sm:px-6"
                    >
                      Ver ubicación demo
                    </a>
                    <p className="mt-6 text-sm leading-7 text-[color:rgba(74,46,42,0.78)] sm:text-base">
                      <span className="font-semibold text-[var(--color-ink)]">Lugar:</span>{" "}
                      Espacio Magnolia
                    </p>
                    <div className="mt-8 hidden lg:flex items-center justify-center gap-3 text-[var(--color-champagne)]">
                      <span className="h-px w-12 bg-[rgba(217,181,109,0.45)]" />
                      <span className="text-sm">✦</span>
                      <span className="h-px w-12 bg-[rgba(217,181,109,0.45)]" />
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>

            <SectionDivider />

            <Reveal delay={120}>
              <section className="px-4 pb-3 pt-12 sm:px-8 sm:pb-6 sm:pt-16 lg:px-12">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-serif-display text-4xl tracking-tight text-[var(--color-ink)] sm:text-5xl">
                    Un adelanto del gran día
                  </h2>
                </div>
                <SectionOrnament />

                <div className="mt-10">
                  <ImageCarousel images={galleryImages} />
                </div>
              </section>
            </Reveal>

          <SectionDivider />

          <Reveal delay={120}>
            <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
                <SectionHeading
                  title="Dress Code"
                description="El código de vestimenta de esta celebración será formal de día. Te dejamos una referencia visual para inspirarte y ayudarte a elegir tu look."
              />
                <SectionOrnament />

                <div className="mx-auto mt-10 max-w-3xl text-center">
                  <a
                    href="#"
                    className="inline-flex min-h-14 items-center justify-center rounded-full border border-[rgba(201,138,148,0.24)] bg-[rgba(255,255,255,0.34)] px-8 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-blush-deep)] shadow-[0_14px_34px_rgba(93,63,59,0.05)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/46 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-champagne)]"
                  >
                    Ver dress code demo
                  </a>

                  <div className="mx-auto mt-7 max-w-2xl rounded-[1.5rem] border border-[rgba(201,138,148,0.16)] bg-[rgba(255,255,255,0.3)] px-4 py-4 backdrop-blur-sm sm:px-5">
                    <p className="text-sm leading-7 text-[color:rgba(74,46,42,0.82)]">
                    Para quienes prefieran tonos claros, sugerimos evitar el blanco pleno.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[color:rgba(74,46,42,0.72)]">
                    Queremos que te sientas cómodo/a, elegante y listo/a para celebrar junto a Sofía y Mateo.
                  </p>
                </div>
              </div>
            </section>
          </Reveal>

          <SectionDivider />

            <Reveal delay={120}>
              <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
                <SectionHeading
                  title="Lista de regalos"
                  description="Lo más importante para nosotros es compartir este día con vos. Si querés hacernos un regalo, podés encontrar algunas opciones en el siguiente enlace."
                />
              <SectionOrnament />

                <div className="mx-auto mt-10 max-w-3xl text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <a
                      href="#"
                      className="inline-flex min-h-14 items-center justify-center rounded-full border border-[rgba(201,138,148,0.24)] bg-[rgba(255,255,255,0.34)] px-8 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-blush-deep)] shadow-[0_14px_34px_rgba(93,63,59,0.05)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/46 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-champagne)]"
                    >
                      Ver lista de regalos
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowGiftDetails(true)}
                      className="inline-flex min-h-14 items-center justify-center rounded-full border border-[rgba(201,138,148,0.24)] bg-[rgba(255,255,255,0.34)] px-8 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-blush-deep)] shadow-[0_14px_34px_rgba(93,63,59,0.05)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/46 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-champagne)]"
                    >
                      Ver datos
                    </button>
                  </div>
                </div>
              </section>
          </Reveal>

            <SectionDivider />

            <Reveal delay={120}>
                <section className="px-4 py-12 sm:px-8 sm:py-14 lg:px-12">
                  <div className="mx-auto max-w-3xl text-center">
                    <div className="flex items-center justify-center gap-2 text-[var(--color-champagne)] sm:gap-3">
                      <span className="text-lg leading-none">♪</span>
                      <h2 className="font-serif-display text-3xl tracking-tight text-[var(--color-ink)] sm:text-5xl">
                        Playlist
                      </h2>
                      <span className="text-lg leading-none">♪</span>
                    </div>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[color:rgba(74,46,42,0.76)] sm:max-w-2xl sm:text-base">
                    Podés recomendar canciones o artistas que no pueden faltar
                    en la fiesta.
                  </p>
                </div>
                <SectionOrnament />

                <div className="mx-auto mt-8 max-w-2xl rounded-[1.5rem] border border-[rgba(201,138,148,0.16)] bg-[rgba(255,253,248,0.52)] px-4 py-5 text-center shadow-[0_18px_44px_rgba(93,63,59,0.05)] backdrop-blur-sm sm:rounded-[1.75rem] sm:px-8 sm:py-6">
                  <a
                    href={SPOTIFY_PLAYLIST_URL}
                    className="inline-flex min-h-14 items-center justify-center rounded-full border border-[rgba(201,138,148,0.24)] bg-[rgba(255,255,255,0.5)] px-8 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-blush-deep)] shadow-[0_14px_34px_rgba(93,63,59,0.05)] transition hover:-translate-y-0.5 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-champagne)]"
                  >
                    Playlist demo de Spotify
                  </a>
                </div>
              </section>
            </Reveal>

            <SectionDivider />

              <Reveal>
                <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
                  <SectionHeading
                    title="Confirmación"
                    description="Nos ayuda muchísimo contar con tu respuesta. Podés completar este formulario para dejarnos tu confirmación hasta el 1 de noviembre."
                  />
                <SectionOrnament />

                <div className="mx-auto mt-10 max-w-3xl rounded-[1.5rem] border border-[rgba(234,216,197,0.48)] bg-[rgba(255,255,255,0.42)] px-4 py-5 shadow-[0_20px_48px_rgba(93,63,59,0.06)] backdrop-blur-md sm:rounded-[2rem] sm:px-7 sm:py-8 lg:px-8">
                  <form onSubmit={handleSubmit} className="grid gap-5">
                    <label className="space-y-2 text-sm font-medium text-[var(--color-ink)]">
                      <span>Nombre y apellido</span>
                        <input
                          required
                          value={formState.fullName}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              fullName: event.target.value,
                            }))
                          }
                          disabled={isSubmitting}
                          className="w-full rounded-2xl border border-white/50 bg-[rgba(255,255,255,0.62)] px-4 py-3 text-base outline-none transition focus:border-[rgba(217,181,109,0.72)] focus:ring-4 focus:ring-[rgba(217,181,109,0.14)]"
                          placeholder="Sofía Martínez"
                        />
                    </label>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <label className="space-y-2 text-sm font-medium text-[var(--color-ink)]">
                        <span>¿Asistís?</span>
                        <select
                          value={formState.attending}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              attending: event.target.value as "Sí" | "No",
                            }))
                          }
                          disabled={isSubmitting}
                          className="w-full rounded-2xl border border-white/50 bg-[rgba(255,255,255,0.62)] px-4 py-3 text-base outline-none transition focus:border-[rgba(217,181,109,0.72)] focus:ring-4 focus:ring-[rgba(217,181,109,0.14)]"
                        >
                          <option value="Sí">Sí</option>
                          <option value="No">No</option>
                        </select>
                      </label>

                      </div>

                    <label className="space-y-2 text-sm font-medium text-[var(--color-ink)]">
                      <span>Restricciones alimentarias</span>
                        <input
                          value={formState.dietaryRestrictions}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              dietaryRestrictions: event.target.value,
                            }))
                          }
                          disabled={isSubmitting}
                          className="w-full rounded-2xl border border-white/50 bg-[rgba(255,255,255,0.62)] px-4 py-3 text-base outline-none transition focus:border-[rgba(217,181,109,0.72)] focus:ring-4 focus:ring-[rgba(217,181,109,0.14)]"
                          placeholder="Ej. Menú vegetariano"
                        />
                    </label>

                    <label className="space-y-2 text-sm font-medium text-[var(--color-ink)]">
                        <span>¿Algo que debamos saber?</span>
                        <textarea
                          rows={4}
                          value={formState.comment}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              comment: event.target.value,
                            }))
                          }
                          disabled={isSubmitting}
                          className="w-full resize-none rounded-2xl border border-white/50 bg-[rgba(255,255,255,0.62)] px-4 py-3 text-base outline-none transition focus:border-[rgba(217,181,109,0.72)] focus:ring-4 focus:ring-[rgba(217,181,109,0.14)]"
                          placeholder="Comentanos aca"
                        />
                    </label>

                    <div className="flex flex-col items-center gap-4 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[var(--color-blush-deep)] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-cream)] shadow-[0_16px_34px_rgba(159,95,104,0.18)] transition hover:-translate-y-0.5 hover:bg-[color:rgba(159,95,104,0.92)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-champagne)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/30 sm:w-auto sm:min-w-72 sm:px-8 sm:tracking-[0.18em]"
                      >
                        {isSubmitting ? "Enviando..." : "Confirmar asistencia"}
                      </button>

                      {success ? (
                        <p className="text-center text-sm font-medium text-[var(--color-blush-deep)]">
                          Gracias por confirmar tu asistencia. Esta es una versión demo.
                        </p>
                      ) : null}

                      {error ? (
                        <p className="text-center text-sm font-medium text-[var(--color-blush-deep)]">
                          No pudimos enviar tu confirmación. Intentá nuevamente.
                        </p>
                      ) : null}
                    </div>
                  </form>
                </div>
              </section>
            </Reveal>

            <SectionDivider />

            <Reveal delay={120}>
              <footer className="px-4 pb-10 pt-12 text-center sm:px-8 sm:pb-12 sm:pt-16 lg:px-12">
                <div className="mx-auto flex max-w-xl items-center justify-center gap-3 text-center text-[10px] uppercase tracking-[0.16em] text-[color:rgba(74,46,42,0.52)] sm:gap-4 sm:text-xs sm:tracking-[0.28em]">
                  <span className="h-px flex-1 bg-[rgba(217,181,109,0.45)]" />
                  <span>Gracias por acompañarnos</span>
                  <span className="h-px flex-1 bg-[rgba(217,181,109,0.45)]" />
                </div>
                <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-[color:rgba(74,46,42,0.78)] sm:text-lg">
                  En este día especial que queremos compartir junto con vos
                </p>
                <p className="mt-6 font-serif-display text-4xl text-[var(--color-ink)] sm:text-5xl">
                  Sofía &amp; Mateo
                </p>
              </footer>
            </Reveal>
          </div>
        </div>
      </div>

      <p className="px-4 pb-3 text-center text-[13px] text-[color:rgba(74,46,42,0.62)] sm:px-6 sm:text-left">
        Created By Ian Acevedo-Scisoftware
      </p>

      {showGiftDetails ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(74,46,42,0.42)] px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-[rgba(234,216,197,0.48)] bg-[#f7f1e8] p-6 shadow-[0_24px_60px_rgba(93,63,59,0.18)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif-display text-3xl text-[var(--color-ink)]">
                  Datos de regalo demo
                </h3>
                <p className="mt-2 text-sm text-[color:rgba(74,46,42,0.72)]">
                  Podés usar estos datos ficticios como referencia visual.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGiftDetails(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,138,148,0.24)] text-lg text-[var(--color-blush-deep)] transition hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-champagne)]"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4 text-left text-[color:rgba(74,46,42,0.84)]">
              <p>
                <span className="font-semibold">Nombre del titular:</span> Sofía
                Martinez
              </p>
              <p>
                <span className="font-semibold">Banco:</span> Banco Demo
              </p>
              <p>
                <span className="font-semibold">Número de CBU:</span>{" "}
                0000000000000000000000
              </p>
              <p>
                <span className="font-semibold">Alias:</span> sofia.mateo.demo
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
