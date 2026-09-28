import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ProjectDetail, ProjectMediaImage } from "@/data/projectsData";
import {
  X,
  Save,
  Copy,
  Download,
  Check,
  Sparkles,
  Globe,
  Settings,
  Loader2,
  Image as ImageIcon,
  Plus,
  Trash2,
  LayoutGrid,
  Upload,
  ArrowUp,
  ArrowDown,
  Minimize2,
  Maximize2,
  Eye,
  EyeOff,
  AlertTriangle,
  Columns,
  Layers,
} from "lucide-react";

import workVitreous from "@/assets/work-vitreous.jpg";
import workNexus from "@/assets/work-nexus.jpg";
import workEditorial from "@/assets/work-editorial.jpg";
import workBrutalist from "@/assets/work-brutalist.jpg";

const PRESET_IMAGES = [
  { id: workVitreous, label: "Arquitectura (Vitreous)" },
  { id: workNexus, label: "UI/UX Travel (Nexus)" },
  { id: workEditorial, label: "Cosmética / Linux (Editorial)" },
  { id: workBrutalist, label: "Branding / System (Brutalist)" },
];

interface ProjectAdminModalProps {
  project: ProjectDetail;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: ProjectDetail) => void;
}

export function ProjectAdminModal({
  project,
  isOpen,
  onClose,
  onUpdate,
}: ProjectAdminModalProps) {
  const [activeTab, setActiveTab] = useState<"es" | "en" | "gallery" | "meta">("es");
  const [isSplitView, setIsSplitView] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // UX controls: Minimize & Opacity toggle
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadIndex, setActiveUploadIndex] = useState<number | "cover" | null>(null);

  // Form local state
  const [titleEs, setTitleEs] = useState(project.title.es);
  const [titleEn, setTitleEn] = useState(project.title.en);

  const [subtitleEs, setSubtitleEs] = useState(project.subtitle.es);
  const [subtitleEn, setSubtitleEn] = useState(project.subtitle.en);

  const [roleEs, setRoleEs] = useState(project.role.es);
  const [roleEn, setRoleEn] = useState(project.role.en);

  const [overviewEs, setOverviewEs] = useState(project.overview.es);
  const [overviewEn, setOverviewEn] = useState(project.overview.en);

  const [challengeEs, setChallengeEs] = useState(project.challenge.es);
  const [challengeEn, setChallengeEn] = useState(project.challenge.en);

  const [solutionEs, setSolutionEs] = useState(project.solution.es);
  const [solutionEn, setSolutionEn] = useState(project.solution.en);

  const [deliverablesEs, setDeliverablesEs] = useState(
    project.deliverables?.es.join("\n") || ""
  );
  const [deliverablesEn, setDeliverablesEn] = useState(
    project.deliverables?.en.join("\n") || ""
  );

  // Category & Tags state
  const [category, setCategory] = useState<"web" | "ui" | "3d" | "animation" | "devops" | "photo">(
    project.category || "web"
  );
  const [categoryLabelEs, setCategoryLabelEs] = useState(
    project.categoryLabel?.es || "Desarrollo Web"
  );
  const [categoryLabelEn, setCategoryLabelEn] = useState(
    project.categoryLabel?.en || "Web Development"
  );
  const [tagEs, setTagEs] = useState(
    project.tag?.es || "Diseño UI/UX · Desarrollo Web"
  );
  const [tagEn, setTagEn] = useState(
    project.tag?.en || "UI/UX Design · Web Dev"
  );

  const [client, setClient] = useState(project.client);
  const [year, setYear] = useState(project.year);
  const [liveUrl, setLiveUrl] = useState(project.liveUrl || "");
  const [techStackStr, setTechStackStr] = useState(project.techStack.join(", "));
  const [youtubeId, setYoutubeId] = useState(project.video?.youtubeId || "");

  // Media & Gallery local state
  const [coverImage, setCoverImage] = useState(project.coverImage);
  const [galleryList, setGalleryList] = useState<ProjectMediaImage[]>(project.gallery || []);

  // Sync state when project changes
  useEffect(() => {
    setTitleEs(project.title.es);
    setTitleEn(project.title.en);
    setSubtitleEs(project.subtitle.es);
    setSubtitleEn(project.subtitle.en);
    setRoleEs(project.role.es);
    setRoleEn(project.role.en);
    setOverviewEs(project.overview.es);
    setOverviewEn(project.overview.en);
    setChallengeEs(project.challenge.es);
    setChallengeEn(project.challenge.en);
    setSolutionEs(project.solution.es);
    setSolutionEn(project.solution.en);
    setDeliverablesEs(project.deliverables?.es.join("\n") || "");
    setDeliverablesEn(project.deliverables?.en.join("\n") || "");

    setCategory(project.category || "web");
    setCategoryLabelEs(project.categoryLabel?.es || "Desarrollo Web");
    setCategoryLabelEn(project.categoryLabel?.en || "Web Development");
    setTagEs(project.tag?.es || "Diseño UI/UX · Desarrollo Web");
    setTagEn(project.tag?.en || "UI/UX Design · Web Dev");

    setClient(project.client);
    setYear(project.year);
    setLiveUrl(project.liveUrl || "");
    setTechStackStr(project.techStack.join(", "));
    setYoutubeId(project.video?.youtubeId || "");
    setCoverImage(project.coverImage);
    setGalleryList(project.gallery || []);
    setIsDirty(false);
  }, [project]);

  // Prevent background scrolling when modal is open (unless minimized)
  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMinimized]);

  // Keyboard shortcut: Ctrl + S or Cmd + S to Save directly to Disk!
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveToDisk();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, titleEs, titleEn, subtitleEs, subtitleEn, roleEs, roleEn, overviewEs, overviewEn, challengeEs, challengeEn, solutionEs, solutionEn, deliverablesEs, deliverablesEn, category, categoryLabelEs, categoryLabelEn, tagEs, tagEn, client, year, liveUrl, techStackStr, youtubeId, coverImage, galleryList]);

  // Construct updated project object
  const getUpdatedProject = (
    customGallery?: ProjectMediaImage[],
    customCover?: string
  ): ProjectDetail => {
    const deliverablesEsArr = deliverablesEs
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const deliverablesEnArr = deliverablesEn
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const techStackArr = techStackStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const activeCover = customCover || coverImage;

    return {
      ...project,
      title: { es: titleEs, en: titleEn },
      subtitle: { es: subtitleEs, en: subtitleEn },
      role: { es: roleEs, en: roleEn },
      category,
      categoryLabel: { es: categoryLabelEs, en: categoryLabelEn },
      tag: { es: tagEs, en: tagEn },
      overview: { es: overviewEs, en: overviewEn },
      challenge: { es: challengeEs, en: challengeEn },
      solution: { es: solutionEs, en: solutionEn },
      deliverables:
        deliverablesEsArr.length > 0 || deliverablesEnArr.length > 0
          ? { es: deliverablesEsArr, en: deliverablesEnArr }
          : undefined,
      client,
      year,
      liveUrl: liveUrl || undefined,
      techStack: techStackArr,
      coverImage: activeCover,
      gallery: customGallery || galleryList,
      video: youtubeId
        ? {
            youtubeId,
            poster: activeCover,
            title: project.video?.title || {
              es: `Video Promocional — ${titleEs}`,
              en: `Official Video — ${titleEn}`,
            },
          }
        : undefined,
    };
  };

  // Broadcast live preview update on every keystroke
  const handleLiveChange = (customGallery?: ProjectMediaImage[], customCover?: string) => {
    setIsDirty(true);
    const updated = getUpdatedProject(customGallery, customCover);
    onUpdate(updated);
  };

  // Upload Local File Handler
  const processUploadedFile = async (file: File, targetIndex?: number | "cover") => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: file.name, base64 }),
        });
        const data = await res.json();
        if (data.url) {
          if (targetIndex === "cover") {
            setCoverImage(data.url);
            handleLiveChange(undefined, data.url);
          } else if (typeof targetIndex === "number") {
            handleUpdateGalleryImage(targetIndex, "src", data.url);
          } else {
            const newImage: ProjectMediaImage = {
              src: data.url,
              alt: file.name.replace(/\.[^/.]+$/, ""),
              span: "full",
              caption: { es: file.name.replace(/\.[^/.]+$/, ""), en: file.name.replace(/\.[^/.]+$/, "") },
            };
            const updatedList = [...galleryList, newImage];
            setGalleryList(updatedList);
            handleLiveChange(updatedList);
          }
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("No se pudo subir la imagen.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetIndex?: number | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file, targetIndex);
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processUploadedFile(file);
    }
  };

  // Gallery Item Handlers
  const handleAddGalleryImage = () => {
    const newImage: ProjectMediaImage = {
      src: workVitreous,
      alt: "Nueva Imagen",
      span: "full",
      caption: { es: "Pie de foto descriptivo", en: "Descriptive image caption" },
    };
    const updatedList = [...galleryList, newImage];
    setGalleryList(updatedList);
    handleLiveChange(updatedList);
  };

  const handleRemoveGalleryImage = (index: number) => {
    const updatedList = galleryList.filter((_, i) => i !== index);
    setGalleryList(updatedList);
    handleLiveChange(updatedList);
  };

  const handleMoveGalleryImage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= galleryList.length) return;

    const updatedList = [...galleryList];
    const temp = updatedList[index];
    updatedList[index] = updatedList[newIndex];
    updatedList[newIndex] = temp;

    setGalleryList(updatedList);
    handleLiveChange(updatedList);
  };

  const handleUpdateGalleryImage = (
    index: number,
    field: keyof ProjectMediaImage | "captionEs" | "captionEn",
    value: string
  ) => {
    const updatedList = galleryList.map((item, i) => {
      if (i !== index) return item;
      if (field === "captionEs") {
        return {
          ...item,
          caption: {
            es: value,
            en: item.caption?.en || value,
          },
        };
      }
      if (field === "captionEn") {
        return {
          ...item,
          caption: {
            es: item.caption?.es || value,
            en: value,
          },
        };
      }
      return { ...item, [field]: value };
    });
    setGalleryList(updatedList);
    handleLiveChange(updatedList);
  };

  const handleSaveToDisk = async () => {
    setIsSaving(true);
    const updated = getUpdatedProject();
    try {
      const res = await fetch("/api/save-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setSaved(true);
        setIsDirty(false);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Atención: No se pudo guardar directamente en disco. Usa el botón 'Copiar Código JSON'.");
      }
    } catch (err) {
      console.error(err);
      alert("Atención: No se pudo conectar al servidor local para guardar en disco.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSafeClose = () => {
    if (isDirty) {
      const confirmClose = window.confirm(
        "⚠️ Tienes cambios en la edición que no has guardado en disco.\n\n¿Estás seguro de que deseas cerrar sin guardar?"
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  if (!isOpen) return null;

  const generateJsonCode = () => {
    const updated = getUpdatedProject();
    return JSON.stringify(updated, null, 2);
  };

  const handleCopyJson = () => {
    const code = generateJsonCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    const code = generateJsonCode();
    const blob = new Blob([code], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.id}-project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render Minimized Widget Mode
  if (isMinimized) {
    return createPortal(
      <div className="fixed bottom-6 right-6 z-[99999] flex items-center gap-3 rounded-full border-2 border-accent bg-[#121212] p-3 text-white shadow-2xl backdrop-blur-md">
        <div className="flex size-9 items-center justify-center rounded-full bg-accent/20 text-accent">
          <Sparkles className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white">Editor Minimizado</span>
          <span className="text-[10px] text-accent font-semibold">{project.id}</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-bold uppercase text-white shadow hover:scale-105"
        >
          <Maximize2 className="size-3.5" />
          <span>Expandir</span>
        </button>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 backdrop-blur-lg transition-opacity duration-300 ${
        isTransparent ? "bg-black/30 opacity-70" : "bg-black/80 opacity-100"
      }`}
    >
      {/* Hidden File Input Element */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, activeUploadIndex ?? undefined)}
      />

      <div className="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border-2 border-accent/40 bg-[#121212] text-[#f5f3ee] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#1a1a1a] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-accent/20 text-accent ring-1 ring-accent/40">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl tracking-tight text-white font-medium">
                  Editor Visual de Proyecto
                </h2>
                {isDirty && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="size-3" />
                    <span>Cambios pendientes (Ctrl+S)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-white/70">
                Proyecto: <span className="font-semibold text-accent">{project.id}</span> — Presiona <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-accent">Ctrl + S</kbd> para guardar directo a disco.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Split-Screen Dual Language Toggle */}
            <button
              type="button"
              onClick={() => setIsSplitView(!isSplitView)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                isSplitView
                  ? "border-accent bg-accent text-white shadow-lg"
                  : "border-white/15 bg-white/5 text-white/80 hover:bg-white/15"
              }`}
              title="Ver Español e Inglés al mismo tiempo"
            >
              <Columns className="size-3.5" />
              <span>Vista Paralela</span>
            </button>

            {/* Toggle Transparent View */}
            <button
              type="button"
              onClick={() => setIsTransparent(!isTransparent)}
              className="rounded-full border border-white/15 bg-white/5 p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              title={isTransparent ? "Modo Opaco" : "Modo Transparente (Inspeccionar fondo)"}
            >
              {isTransparent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>

            {/* Minimize Modal */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="rounded-full border border-white/15 bg-white/5 p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              title="Minimizar editor"
            >
              <Minimize2 className="size-4" />
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={handleSafeClose}
              className="rounded-full border border-white/15 bg-white/5 p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Cerrar editor"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        {!isSplitView && (
          <div className="flex flex-wrap border-b border-white/10 bg-[#161616] px-6">
            <button
              type="button"
              onClick={() => setActiveTab("es")}
              className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "es"
                  ? "border-accent text-accent bg-white/5"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              <Globe className="size-4" />
              <span>Español (ES)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "en"
                  ? "border-accent text-accent bg-white/5"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              <Globe className="size-4" />
              <span>English (EN)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "gallery"
                  ? "border-accent text-accent bg-white/5"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              <ImageIcon className="size-4" />
              <span>Galería de Imágenes ({galleryList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("meta")}
              className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "meta"
                  ? "border-accent text-accent bg-white/5"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              <Settings className="size-4" />
              <span>Categoría & Metadatos</span>
            </button>
          </div>
        )}

        {/* Form Body Content */}
        <div className="flex-1 overflow-y-auto bg-[#121212] p-6 space-y-6">
          {/* OPTION A: PARALLEL SPLIT-VIEW MODE (ES + EN SIDE BY SIDE) */}
          {isSplitView && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/10 px-5 py-3">
                <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                  <Columns className="size-4" />
                  <span>Modo Vista Paralela — Editando Español e Inglés al mismo tiempo</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsSplitView(false)}
                  className="text-xs font-semibold text-white/70 underline hover:text-white"
                >
                  Volver a Pestañas
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* LEFT COLUMN: ESPAÑOL */}
                <div className="space-y-6 rounded-2xl border border-white/10 bg-[#171717] p-5">
                  <h3 className="font-serif text-lg text-accent font-bold border-b border-white/10 pb-3 flex items-center gap-2">
                    <Globe className="size-4" />
                    <span>Contenido en Español (ES)</span>
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/80">Título (ES)</label>
                    <input
                      type="text"
                      value={titleEs}
                      onChange={(e) => { setTitleEs(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/80">Rol / Servicio (ES)</label>
                    <input
                      type="text"
                      value={roleEs}
                      onChange={(e) => { setRoleEs(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/80">Subtítulo (ES)</label>
                    <textarea
                      rows={2}
                      value={subtitleEs}
                      onChange={(e) => { setSubtitleEs(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-accent font-bold">01 / Visión General (ES)</label>
                    <textarea
                      rows={3}
                      value={overviewEs}
                      onChange={(e) => { setOverviewEs(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-accent font-bold">02 / El Desafío (ES)</label>
                    <textarea
                      rows={3}
                      value={challengeEs}
                      onChange={(e) => { setChallengeEs(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-accent font-bold">03 / La Solución (ES)</label>
                    <textarea
                      rows={3}
                      value={solutionEs}
                      onChange={(e) => { setSolutionEs(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN: ENGLISH */}
                <div className="space-y-6 rounded-2xl border border-white/10 bg-[#171717] p-5">
                  <h3 className="font-serif text-lg text-accent font-bold border-b border-white/10 pb-3 flex items-center gap-2">
                    <Globe className="size-4" />
                    <span>English Content (EN)</span>
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/80">Title (EN)</label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => { setTitleEn(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/80">Role / Service (EN)</label>
                    <input
                      type="text"
                      value={roleEn}
                      onChange={(e) => { setRoleEn(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/80">Subtitle (EN)</label>
                    <textarea
                      rows={2}
                      value={subtitleEn}
                      onChange={(e) => { setSubtitleEn(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-accent font-bold">01 / Overview (EN)</label>
                    <textarea
                      rows={3}
                      value={overviewEn}
                      onChange={(e) => { setOverviewEn(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-accent font-bold">02 / Challenge (EN)</label>
                    <textarea
                      rows={3}
                      value={challengeEn}
                      onChange={(e) => { setChallengeEn(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-accent font-bold">03 / Solution (EN)</label>
                    <textarea
                      rows={3}
                      value={solutionEn}
                      onChange={(e) => { setSolutionEn(e.target.value); handleLiveChange(); }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ESPAÑOL (Single Tab View) */}
          {!isSplitView && activeTab === "es" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-accent">
                    Título (ES)
                  </label>
                  <input
                    type="text"
                    value={titleEs}
                    onChange={(e) => {
                      setTitleEs(e.target.value);
                      handleLiveChange();
                    }}
                    className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-accent">
                    Rol / Servicio (ES)
                  </label>
                  <input
                    type="text"
                    value={roleEs}
                    onChange={(e) => {
                      setRoleEs(e.target.value);
                      handleLiveChange();
                    }}
                    className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  Subtítulo / Eslogan (ES)
                </label>
                <textarea
                  rows={2}
                  value={subtitleEs}
                  onChange={(e) => {
                    setSubtitleEs(e.target.value);
                    handleLiveChange();
                  }}
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  01 / Visión General (ES)
                </label>
                <textarea
                  rows={3}
                  value={overviewEs}
                  onChange={(e) => {
                    setOverviewEs(e.target.value);
                    handleLiveChange();
                  }}
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  02 / El Desafío (ES)
                </label>
                <textarea
                  rows={3}
                  value={challengeEs}
                  onChange={(e) => {
                    setChallengeEs(e.target.value);
                    handleLiveChange();
                  }}
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  03 / La Solución (ES)
                </label>
                <textarea
                  rows={3}
                  value={solutionEs}
                  onChange={(e) => {
                    setSolutionEs(e.target.value);
                    handleLiveChange();
                  }}
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  Entregables Clave (ES) — Un elemento por línea
                </label>
                <textarea
                  rows={4}
                  value={deliverablesEs}
                  onChange={(e) => {
                    setDeliverablesEs(e.target.value);
                    handleLiveChange();
                  }}
                  placeholder="Diseño completo en Figma&#10;Desarrollo Frontend en Next.js&#10;Optimización WPO"
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ENGLISH (Single Tab View) */}
          {!isSplitView && activeTab === "en" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-accent">
                    Title (EN)
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => {
                      setTitleEn(e.target.value);
                      handleLiveChange();
                    }}
                    className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-accent">
                    Role / Service (EN)
                  </label>
                  <input
                    type="text"
                    value={roleEn}
                    onChange={(e) => {
                      setRoleEn(e.target.value);
                      handleLiveChange();
                    }}
                    className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  Subtitle / Tagline (EN)
                </label>
                <textarea
                  rows={2}
                  value={subtitleEn}
                  onChange={(e) => {
                    setSubtitleEn(e.target.value);
                    handleLiveChange();
                  }}
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  01 / Overview (EN)
                </label>
                <textarea
                  rows={3}
                  value={overviewEn}
                  onChange={(e) => {
                    setOverviewEn(e.target.value);
                    handleLiveChange();
                  }}
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  02 / The Challenge (EN)
                </label>
                <textarea
                  rows={3}
                  value={challengeEn}
                  onChange={(e) => {
                    setChallengeEn(e.target.value);
                    handleLiveChange();
                  }}
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  03 / The Solution (EN)
                </label>
                <textarea
                  rows={3}
                  value={solutionEn}
                  onChange={(e) => {
                    setSolutionEn(e.target.value);
                    handleLiveChange();
                  }}
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  Key Deliverables (EN) — One item per line
                </label>
                <textarea
                  rows={4}
                  value={deliverablesEn}
                  onChange={(e) => {
                    setDeliverablesEn(e.target.value);
                    handleLiveChange();
                  }}
                  placeholder="Full Figma Design System&#10;Next.js Frontend Architecture&#10;Speed Optimization"
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: GALERÍA DE IMÁGENES CON DRAG & DROP & MINIATURAS VISUALES */}
          {!isSplitView && activeTab === "gallery" && (
            <div className="space-y-8">
              {/* Cover Hero Image Selection with Visual Thumbnails */}
              <div className="rounded-2xl border border-white/15 bg-[#1b1b1b] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                    <ImageIcon className="size-4" />
                    <span>Imagen de Portada Principal (Cover Image)</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveUploadIndex("cover");
                      fileInputRef.current?.click();
                    }}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-3.5 py-1.5 text-xs font-bold text-white hover:bg-accent/80 transition-colors shadow-sm"
                  >
                    <Upload className="size-3.5" />
                    <span>Subir Portada desde PC</span>
                  </button>
                </div>

                {/* Visual Thumbnail Picker for Cover */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PRESET_IMAGES.map((preset) => {
                    const isSelected = coverImage === preset.id;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setCoverImage(preset.id);
                          handleLiveChange(undefined, preset.id);
                        }}
                        className={`group relative flex flex-col items-center overflow-hidden rounded-xl border-2 p-1.5 transition-all ${
                          isSelected
                            ? "border-accent bg-accent/15 ring-2 ring-accent/40 scale-[1.02]"
                            : "border-white/10 bg-[#222222] hover:border-white/30"
                        }`}
                      >
                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/40">
                          <img
                            src={preset.id}
                            alt={preset.label}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <span className="mt-1.5 text-[10px] font-semibold text-white/90 truncate w-full text-center">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  setActiveUploadIndex(null);
                  fileInputRef.current?.click();
                }}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDraggingOver
                    ? "border-accent bg-accent/20 scale-[1.01]"
                    : "border-white/20 bg-[#161616] hover:border-accent/60 hover:bg-[#1c1c1c]"
                }`}
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-accent/20 text-accent mb-3">
                  <Upload className="size-6" />
                </div>
                <h4 className="font-serif text-lg text-white font-medium">
                  {isDraggingOver
                    ? "¡Sueltas tus imágenes aquí!"
                    : "Arrastra y suelta imágenes de tu computadora aquí"}
                </h4>
                <p className="mt-1 text-xs text-white/60">
                  o haz clic aquí para seleccionar archivos (<span className="text-accent font-semibold">.jpg, .png, .webp, .svg</span>)
                </p>
              </div>

              {/* Dynamic Gallery Image Cards */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <h3 className="font-serif text-xl tracking-tight text-white flex items-center gap-2">
                    <LayoutGrid className="size-5 text-accent" />
                    <span>Imágenes de Galería ({galleryList.length})</span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/20"
                  >
                    <Plus className="size-4" />
                    <span>Agregar Asset Predefinido</span>
                  </button>
                </div>

                {galleryList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-white/60">
                    No hay imágenes en la galería. Usa la zona de arrastrar arriba para añadir fotos a este proyecto.
                  </div>
                ) : (
                  galleryList.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/15 bg-[#1a1a1a] p-5 space-y-4 shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                            <span>Imagen #{idx + 1}</span>
                            {img.src.startsWith("/uploads/") && (
                              <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] text-accent border border-accent/30 font-semibold">
                                Subida Local
                              </span>
                            )}
                          </span>

                          {/* Reordering Controls */}
                          <div className="flex items-center gap-1 border-l border-white/15 pl-3">
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, "up")}
                              disabled={idx === 0}
                              className="rounded-md border border-white/15 p-1 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30"
                              title="Subir posición"
                            >
                              <ArrowUp className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, "down")}
                              disabled={idx === galleryList.length - 1}
                              className="rounded-md border border-white/15 p-1 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30"
                              title="Bajar posición"
                            >
                              <ArrowDown className="size-3.5" />
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 items-center">
                        <div className="size-20 overflow-hidden rounded-xl border border-white/20 bg-black/40 shrink-0 sm:col-span-2">
                          <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                        </div>

                        <div className="space-y-1.5 sm:col-span-6">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                            Ruta de Imagen / URL
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={img.src}
                              onChange={(e) =>
                                handleUpdateGalleryImage(idx, "src", e.target.value)
                              }
                              className="w-full rounded-xl border border-white/15 bg-[#222222] px-3.5 py-2 text-xs text-white focus:border-accent focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setActiveUploadIndex(idx);
                                fileInputRef.current?.click();
                              }}
                              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 shrink-0"
                              title="Reemplazar desde la PC"
                            >
                              <Upload className="size-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5 sm:col-span-4">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                            Ancho / Disposición en Pantalla
                          </label>
                          <select
                            value={img.span || "full"}
                            onChange={(e) =>
                              handleUpdateGalleryImage(idx, "span", e.target.value as "full" | "half")
                            }
                            className="w-full rounded-xl border border-white/15 bg-[#222222] px-3.5 py-2 text-xs text-white focus:border-accent focus:outline-none"
                          >
                            <option value="full">Ancho Completo (1 Columna)</option>
                            <option value="half">Mitad de Ancho (2 Columnas)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                            Pie de Foto (ES)
                          </label>
                          <input
                            type="text"
                            value={img.caption?.es || ""}
                            onChange={(e) =>
                              handleUpdateGalleryImage(idx, "captionEs", e.target.value)
                            }
                            placeholder="Descripción de la imagen en español"
                            className="w-full rounded-xl border border-white/15 bg-[#222222] px-3.5 py-2 text-xs text-white focus:border-accent focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                            Pie de Foto (EN)
                          </label>
                          <input
                            type="text"
                            value={img.caption?.en || ""}
                            onChange={(e) =>
                              handleUpdateGalleryImage(idx, "captionEn", e.target.value)
                            }
                            placeholder="Descriptive caption in English"
                            className="w-full rounded-xl border border-white/15 bg-[#222222] px-3.5 py-2 text-xs text-white focus:border-accent focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORÍA & METADATOS (Single Tab View) */}
          {!isSplitView && activeTab === "meta" && (
            <div className="space-y-6">
              {/* Category Selector */}
              <div className="rounded-2xl border border-white/15 bg-[#1b1b1b] p-5 space-y-4">
                <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                  <Settings className="size-4 text-accent" />
                  <span>Categoría Principal del Portafolio</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-accent">
                      Categoría (Filtro)
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const newCat = e.target.value as "web" | "ui" | "3d" | "animation" | "devops" | "photo";
                        setCategory(newCat);
                        if (newCat === "web") {
                          setCategoryLabelEs("Desarrollo Web");
                          setCategoryLabelEn("Web Development");
                        } else if (newCat === "ui") {
                          setCategoryLabelEs("Diseño UI/UX");
                          setCategoryLabelEn("UI/UX Design");
                        } else if (newCat === "3d") {
                          setCategoryLabelEs("3D & Modelado");
                          setCategoryLabelEn("3D & Modeling");
                        } else if (newCat === "animation") {
                          setCategoryLabelEs("Animación / VFX / Postproducción");
                          setCategoryLabelEn("Animation / VFX / Post-Production");
                        } else if (newCat === "photo") {
                          setCategoryLabelEs("Edición de Foto");
                          setCategoryLabelEn("Photo Editing");
                        } else if (newCat === "devops") {
                          setCategoryLabelEs("DevOps & SysAdmin");
                          setCategoryLabelEn("DevOps & SysAdmin");
                        }
                        handleLiveChange();
                      }}
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    >
                      <option value="web">Desarrollo Web (web)</option>
                      <option value="ui">Diseño UI/UX (ui)</option>
                      <option value="3d">3D & Modelado (3d)</option>
                      <option value="animation">Animación / VFX / Postproducción (animation)</option>
                      <option value="photo">Edición de Foto (photo)</option>
                      <option value="devops">DevOps & Linux SysAdmin (devops)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-accent">
                      Etiqueta Corta (Tag)
                    </label>
                    <input
                      type="text"
                      value={tagEs}
                      onChange={(e) => {
                        setTagEs(e.target.value);
                        handleLiveChange();
                      }}
                      placeholder="Diseño UI/UX · Desarrollo Web"
                      className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-accent">
                    Cliente
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => {
                      setClient(e.target.value);
                      handleLiveChange();
                    }}
                    className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-accent">
                    Año
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      handleLiveChange();
                    }}
                    className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  Enlace al Sitio Web Real (URL)
                </label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => {
                    setLiveUrl(e.target.value);
                    handleLiveChange();
                  }}
                  placeholder="https://ejemplo.com"
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  Stack Tecnológico (Separado por comas)
                </label>
                <input
                  type="text"
                  value={techStackStr}
                  onChange={(e) => {
                    setTechStackStr(e.target.value);
                    handleLiveChange();
                  }}
                  placeholder="Next.js, TypeScript, Tailwind CSS, Webflow"
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">
                  ID de Video de YouTube (Opcional)
                </label>
                <input
                  type="text"
                  value={youtubeId}
                  onChange={(e) => {
                    setYoutubeId(e.target.value);
                    handleLiveChange();
                  }}
                  placeholder="nY0MLClNavQ"
                  className="w-full rounded-xl border border-white/15 bg-[#222222] px-4 py-2.5 text-sm text-white focus:border-accent focus:bg-[#2a2a2a] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 bg-[#161616] px-6 py-4 sm:flex-row">
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Action: Direct Save to Disk */}
            <button
              type="button"
              onClick={handleSaveToDisk}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : saved ? (
                <>
                  <Check className="size-4 text-white" />
                  <span>¡Guardado en Disco!</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Guardar Cambios (Ctrl+S)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/20"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>Copiar JSON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/20"
            >
              <Download className="size-4" />
              <span>Descargar JSON</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSafeClose}
            className="text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white"
          >
            Cerrar Editor
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
