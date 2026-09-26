"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import MediaSlot from "./MediaSlot";
import { cx } from "@/lib/cx";
import { track } from "@/lib/analytics";
import { MEDIA } from "@/data/media";
import {
  PROJECTS,
  PROJECTS_PENDING,
  PROJECT_FILTERS,
  LOCATION_UNCONFIRMED,
  type Project,
  type ProjectFilterId,
} from "@/data/projects";

/**
 * ============================================================================
 * PROJECT GALLERY
 * ----------------------------------------------------------------------------
 * The full gallery is built and wired - filters, lightbox, keyboard handling
 * and the before/after viewer all work. The data array is currently empty
 * because no project photographs have been supplied yet, so the component
 * renders an honest pending state instead.
 *
 * WHAT IS DELIBERATELY NOT DONE
 * A grid of grey boxes captioned with invented project names, guessed
 * locations and fabricated descriptions. That is fake evidence of work, and it
 * is the single worst thing this site could ship. The empty state below says
 * plainly that photographs are coming.
 *
 * TO POPULATE: append objects to PROJECTS in src/data/projects.ts. Nothing in
 * this file needs to change - the filters, lightbox and before/after viewer
 * pick them up automatically.
 * ============================================================================
 */

export default function ProjectGallery() {
  const [filter, setFilter] = useState<ProjectFilterId>("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === filter),
    [filter],
  );

  if (PROJECTS_PENDING) return <PendingState />;

  return (
    <div>
      {/* Filters. Only rendered when there is something to filter. */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-2 text-muted">Filter</span>
        {PROJECT_FILTERS.map((option) => {
          const active = filter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option.id)}
              className={cx(
                "min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors",
                active
                  ? "border-green-ink bg-green text-black"
                  : "border-line bg-white text-ink hover:border-green-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-lg text-muted">
          No projects in this category yet.
        </p>
      ) : (
        <ul role="list" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  const cover = project.photos[0];
  const large = project.size === "large";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track("project_viewed", {
            location: "projects",
            action: "project_open",
            service: project.category,
          });
        }}
        className={cx(
          "group relative block w-full overflow-hidden rounded-lg border border-line bg-white text-left",
          large ? "lg:col-span-2" : "",
        )}
      >
        <span
          className="relative block"
          style={{ aspectRatio: cover.orientation === "landscape" ? "16 / 10" : "4 / 5" }}
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            quality={75}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </span>

        <span className="block p-5">
          <span className="eyebrow text-green-ink">{project.category}</span>
          <span className="mt-2 block font-display text-lg font-extrabold tracking-[-0.02em] text-ink">
            {project.title}
          </span>
          <span className="mt-1 block text-sm text-muted">
            {project.location ?? LOCATION_UNCONFIRMED}
          </span>
        </span>
      </button>

      {open ? (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          labelledBy={`project-${project.id}-title`}
          panelClassName="max-w-5xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-green-ink">{project.category}</p>
              <h3
                id={`project-${project.id}-title`}
                className="mt-3 text-display-sm text-ink"
              >
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {project.location ?? LOCATION_UNCONFIRMED}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl leading-none text-muted hover:text-ink"
            >
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close project</span>
            </button>
          </div>

          <div className="mt-6">
            {project.beforeAfter && project.photos.length === 2 ? (
              <BeforeAfter
                before={project.photos[0]}
                after={project.photos[1]}
                projectTitle={project.title}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {project.photos.map((photo) => (
                  <span
                    key={photo.src}
                    className="relative block overflow-hidden rounded-[2px] bg-surface"
                    style={{ aspectRatio: "4 / 3" }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 640px) 45vw, 100vw"
                      quality={75}
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink">
            {project.description}
          </p>

          {project.workCompleted.length > 0 ? (
            <ul className="mt-5 flex flex-col gap-2">
              {project.workCompleted.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-ink" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-6 text-xs text-muted">
            {project.photos.length} photo{project.photos.length === 1 ? "" : "s"}
          </p>
        </Modal>
      ) : null}
    </>
  );
}

/**
 * Before / after comparison.
 *
 * The control is a real <input type="range">, not a draggable div: it is
 * keyboard operable, announces its value to screen readers, and works with
 * assistive touch. The visible divider follows the input.
 */
function BeforeAfter({
  before,
  after,
  projectTitle,
}: {
  before: Project["photos"][number];
  after: Project["photos"][number];
  projectTitle: string;
}) {
  const [position, setPosition] = useState(50);
  const id = `ba-${before.src.replace(/\W+/g, "-")}`;

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-[2px] bg-surface"
        style={{ aspectRatio: "16 / 10" }}
      >
        {/* After (base layer) */}
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          quality={75}
          className="object-cover"
        />

        {/* Before (clipped from the left) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={before.src}
            alt={before.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            quality={75}
            className="object-cover"
          />
        </div>

        <span className="pointer-events-none absolute inset-y-0 w-0.5 bg-green" style={{ left: `${position}%` }} aria-hidden="true" />

        <span className="pointer-events-none absolute left-3 top-3 rounded-[2px] bg-black/75 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-[2px] bg-black/75 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
          After
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        Compare before and after for {projectTitle}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="mt-3 w-full accent-[#17734a]"
        aria-valuetext={`${position}% before shown`}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function PendingState() {
  return (
    <div>
      <div className="rounded-[2px] border border-line bg-white p-6 sm:p-8">
        <p className="eyebrow text-green-ink">Gallery</p>
        <h3 className="mt-4 text-display-sm text-ink">
          Project photographs are being added
        </h3>
        <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted sm:text-lg">
          Completed-work photos are being gathered and cleared for use. This
          space is intentionally left empty until they are ready - a gallery of
          stock images or invented project names would misrepresent the work, so
          it stays honest instead.
        </p>
        <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted">
          In the meantime, the range of work is set out on the{" "}
          <a href="/services" className="font-semibold text-green-ink underline underline-offset-4">
            services page
          </a>
          , and you can send photos of your own job straight through WhatsApp.
        </p>
      </div>

      {/* Planned slots, so the layout is visible and stable before assets land. */}
      <ul role="list" className="mt-6 grid gap-5 sm:grid-cols-2">
        {[
          { slot: MEDIA.domesticBreak, span: "sm:col-span-2" },
          { slot: MEDIA.aboutSecondary, span: "" },
          { slot: MEDIA.membership, span: "" },
        ].map(({ slot, span }) => (
          <li key={slot.needs} className={span}>
            <MediaSlot slot={slot} sizes="(min-width: 640px) 50vw, 100vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}
