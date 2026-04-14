import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Github, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Lang = "ko" | "en";

// ─────────────────────────────────────────────────────────────────────────────
// Bilingual content
// TODO 주석이 있는 항목은 직접 수정해주세요.
// ─────────────────────────────────────────────────────────────────────────────

interface Project {
  name: string;
  description: string;
  tags: string[];
  appStoreUrl: string | null;
  githubUrl: string | null;
  featured?: boolean;
}

interface LangContent {
  name: string;
  role: string;
  tagline: string;
  ctaAppStore: string;
  ctaGitHub: string;
  techTitle: string;
  projectsTitle: string;
  screenshotsTitle: string;
  contactTitle: string;
  contactEmail: string;
  contactGitHub: string;
  projects: Project[];
  copyright: string;
}

const content: Record<Lang, LangContent> = {
  ko: {
    name: "TODO: 이름",                           // TODO: 실제 이름으로 변경
    role: "TODO: 직함",                           // TODO: 예) iOS & React 개발자
    tagline: "TODO: 한 줄 소개",                  // TODO: 예) 사용자 경험을 개선하는 앱을 만듭니다
    ctaAppStore: "App Store",
    ctaGitHub: "GitHub",
    techTitle: "기술 스택",
    projectsTitle: "프로젝트",
    screenshotsTitle: "앱 스크린샷",
    contactTitle: "연락처",
    contactEmail: "TODO: 이메일 주소",             // TODO: 실제 이메일로 변경
    contactGitHub: "TODO: GitHub URL",            // TODO: 예) https://github.com/zziraengi
    projects: [
      {
        name: "스티커 크롭",
        description:
          "KakaoTalk & Naver OGQ 플랫폼용 스티커 이미지를 자동으로 분할·변환하는 iOS 앱. 드래그 앤 드롭 순서 변경, 자동 그리드 감지, 채팅 미리보기 등을 지원합니다.",
        tags: ["iOS", "Capacitor", "React", "Canvas API"],
        appStoreUrl: "https://apps.apple.com/kr/app/스티커-크롭/id6754418208",
        githubUrl: null,
        featured: true,
      },
      {
        name: "TODO: 프로젝트 2",                 // TODO: 프로젝트 이름으로 변경
        description: "TODO: 프로젝트 설명",        // TODO: 설명으로 변경
        tags: ["TODO"],
        appStoreUrl: null,
        githubUrl: "TODO: GitHub URL",
      },
      {
        name: "TODO: 프로젝트 3",                 // TODO: 프로젝트 이름으로 변경
        description: "TODO: 프로젝트 설명",        // TODO: 설명으로 변경
        tags: ["TODO"],
        appStoreUrl: null,
        githubUrl: "TODO: GitHub URL",
      },
    ],
    copyright: "© 2025 zziraengi. All rights reserved.",
  },
  en: {
    name: "TODO: Name",                           // TODO: Replace with actual name
    role: "TODO: Role",                           // TODO: e.g. iOS & React Developer
    tagline: "TODO: One-line tagline",            // TODO: e.g. Building apps that improve user experience
    ctaAppStore: "App Store",
    ctaGitHub: "GitHub",
    techTitle: "Tech Stack",
    projectsTitle: "Projects",
    screenshotsTitle: "App Screenshots",
    contactTitle: "Contact",
    contactEmail: "TODO: email address",          // TODO: Replace with actual email
    contactGitHub: "TODO: GitHub URL",            // TODO: e.g. https://github.com/zziraengi
    projects: [
      {
        name: "Sticker Crop",
        description:
          "An iOS app that automatically splits and converts sticker images for KakaoTalk & Naver OGQ platforms. Features drag-and-drop reordering, auto grid detection, and chat preview.",
        tags: ["iOS", "Capacitor", "React", "Canvas API"],
        appStoreUrl: "https://apps.apple.com/kr/app/스티커-크롭/id6754418208",
        githubUrl: null,
        featured: true,
      },
      {
        name: "TODO: Project 2",                  // TODO: Replace with project name
        description: "TODO: Project description", // TODO: Replace with description
        tags: ["TODO"],
        appStoreUrl: null,
        githubUrl: "TODO: GitHub URL",
      },
      {
        name: "TODO: Project 3",                  // TODO: Replace with project name
        description: "TODO: Project description", // TODO: Replace with description
        tags: ["TODO"],
        appStoreUrl: null,
        githubUrl: "TODO: GitHub URL",
      },
    ],
    copyright: "© 2025 zziraengi. All rights reserved.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Tech stack badges (language-neutral)
// ─────────────────────────────────────────────────────────────────────────────

const techStack = [
  { label: "React", color: "bg-sky-100 text-sky-800" },
  { label: "TypeScript", color: "bg-blue-100 text-blue-800" },
  { label: "Capacitor / iOS", color: "bg-indigo-100 text-indigo-800" },
  { label: "Tailwind CSS", color: "bg-teal-100 text-teal-800" },
  { label: "Canvas API", color: "bg-orange-100 text-orange-800" },
  { label: "Vite", color: "bg-purple-100 text-purple-800" },
  { label: "Framer Motion", color: "bg-pink-100 text-pink-800" },
  { label: "shadcn/ui", color: "bg-gray-100 text-gray-700" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Screenshots
// TODO: client/public/screenshots/ 폴더에 실제 스크린샷 이미지를 넣고 경로를 수정하세요.
// ─────────────────────────────────────────────────────────────────────────────

const screenshots = [
  "/screenshots/screenshot-1.png",
  "/screenshots/screenshot-2.png",
  "/screenshots/screenshot-3.png",
];

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const staggerItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [lang, setLang] = useState<Lang>("ko");
  const t = content[lang];

  return (
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{ fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif" }}
    >
      {/* Language Toggle */}
      <button
        onClick={() => setLang((l) => (l === "ko" ? "en" : "ko"))}
        className="fixed top-4 right-4 z-50 px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
      >
        {lang === "ko" ? "EN" : "KO"}
      </button>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.h1
            variants={heroItemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900"
            style={{ letterSpacing: "-0.02em" }}
          >
            {t.name}
          </motion.h1>

          <motion.p
            variants={heroItemVariants}
            className="mt-3 text-xl md:text-2xl font-medium text-gray-500"
          >
            {t.role}
          </motion.p>

          <motion.p
            variants={heroItemVariants}
            className="mt-4 text-base md:text-lg text-gray-400 max-w-md leading-relaxed"
          >
            {t.tagline}
          </motion.p>

          <motion.div
            variants={heroItemVariants}
            className="mt-8 flex gap-3 flex-wrap justify-center"
          >
            <Button asChild className="bg-gray-900 text-white hover:bg-gray-700 rounded-full px-6 h-11 text-sm font-medium">
              <a
                href="https://apps.apple.com/kr/app/스티커-크롭/id6754418208"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                {t.ctaAppStore}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-6 h-11 text-sm font-medium border-gray-300"
            >
              <a
                href={t.contactGitHub}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-2" />
                {t.ctaGitHub}
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────── */}
      <section id="tech" className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8">
            {t.techTitle}
          </h2>
          <motion.div
            className="flex flex-wrap gap-2"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {techStack.map((tech) => (
              <motion.span
                key={tech.label}
                variants={staggerItemVariants}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium",
                  tech.color
                )}
              >
                {tech.label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Projects ─────────────────────────────────────── */}
      <section id="projects" className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8">
            {t.projectsTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.projects.map((project, index) => (
            <motion.div
              key={project.name}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white flex flex-col",
                project.featured && "ring-1 ring-gray-200"
              )}
            >
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed flex-1">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex gap-3 items-center">
                {project.appStoreUrl && (
                  <a
                    href={project.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    App Store
                  </a>
                )}
                {project.githubUrl && !project.githubUrl.startsWith("TODO") && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
                  >
                    <Github className="w-3 h-3" />
                    GitHub
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── App Screenshots ──────────────────────────────── */}
      <section id="screenshots" className="py-24">
        <motion.div
          className="px-6 max-w-4xl mx-auto"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            {t.screenshotsTitle}
          </h2>
        </motion.div>

        <motion.div
          className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {screenshots.map((src, i) => (
            <div
              key={i}
              className="snap-start flex-shrink-0 w-48 md:w-56 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50"
            >
              <img
                src={src}
                alt={`App screenshot ${i + 1}`}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  // 이미지가 없을 경우 placeholder 표시
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".screenshot-placeholder")) {
                    const placeholder = document.createElement("div");
                    placeholder.className =
                      "screenshot-placeholder w-full aspect-[9/19.5] flex items-center justify-center text-gray-300 text-xs";
                    placeholder.textContent = `screenshot-${i + 1}`;
                    parent.appendChild(placeholder);
                  }
                }}
              />
            </div>
          ))}
        </motion.div>

        <p className="mt-3 px-6 text-xs text-gray-400 max-w-4xl mx-auto">
          {/* TODO: client/public/screenshots/ 폴더에 스크린샷 이미지를 추가하세요 */}
        </p>
      </section>

      {/* ── Contact ──────────────────────────────────────── */}
      <section id="contact" className="py-24 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8">
            {t.contactTitle}
          </h2>

          {!t.contactEmail.startsWith("TODO") && (
            <a
              href={`mailto:${t.contactEmail}`}
              className="block text-2xl md:text-3xl font-medium text-gray-900 hover:text-gray-500 transition-colors"
            >
              <Mail className="inline-block w-5 h-5 mr-2 align-middle" />
              {t.contactEmail}
            </a>
          )}

          {t.contactEmail.startsWith("TODO") && (
            <p className="text-2xl md:text-3xl font-medium text-gray-300">
              TODO: 이메일 주소
            </p>
          )}

          {!t.contactGitHub.startsWith("TODO") && (
            <a
              href={t.contactGitHub}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-3 text-lg text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
            >
              <Github className="w-4 h-4" />
              {t.contactGitHub}
            </a>
          )}

          {t.contactGitHub.startsWith("TODO") && (
            <p className="mt-3 text-lg text-gray-300">TODO: GitHub URL</p>
          )}
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="py-8 px-6 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">{t.copyright}</p>
      </footer>
    </div>
  );
}
