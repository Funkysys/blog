"use client";

import { DatePickerDemo } from "@/components/DatePicker";
import PageTitle from "@/components/PageTitle";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hook/useCategories";
import { PostWithCategory } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FormEventHandler,
  SyntheticEvent,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import TiptapEditor from "@/components/TiptapEditor";

import TeamSelectorV2 from "@/components/TeamSelectorV2";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hook/usePost";
import { TeamMember } from "@/types";
import { slugify } from "@/utils/slugify";
import axios from "axios";
import Image from "next/image";
import { useMutation } from "react-query";
import { uploadFile } from "../../../api/upload/upload.action";

type Link = {
  id: number;
  name: string;
  url: string;
};
type Track = {
  id: number;
  name: string;
  number?: number;
};

type Category = {
  id: string;
  title: string;
};

// Type pour les paramètres Next.js 15+
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type oldPost = {
  artist: string;
  catTitle: string;
  content: string;
  id: string;
  image: string;
  links: Link[];
  nbComments: number;
  date: Date;
  nbView: number;
  slug: string;
  team: TeamMember[];
  title: string;
  trackList: Track[];
};

export default function UpdatePostePage({ params }: Props) {
  const { slug } = use(params);

  const [oldPost, setOldPost] = useState<oldPost>({} as oldPost);

  const { data: post, isFetching: postIsFetching, error } = usePost(slug);

  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [artist, setArtist] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tracks, setTracks] = useState<Track[]>([{ id: 1, name: "" }]);
  const [links, setLinks] = useState<Link[]>([]); // Supprimer Prisma.JsonArray
  const [tempLink, setTempLink] = useState<Link[]>([
    { id: 1, name: "", url: "" },
  ]);
  const [date, setDate] = useState<Date | null>(null);

  const [file, setFile] = useState<File>();
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);

  const { data: categories, isFetching } = useCategories();

  const router = useRouter();

  const updatePost = (updatePost: Partial<PostWithCategory>) =>
    axios.put(`/api/update/${slug}`, updatePost).then((res) => res.data);

  const {
    mutate,
    data: updatePostData,
    isLoading,
  } = useMutation(updatePost, {
    onSuccess: (data: PostWithCategory) => {
      router.push(`/posts/${data.slug}`);
    },
  });

  const { status } = useSession();

  useEffect(() => {
    if (post && post.id) {
      setOldPost({
        artist: post.artist || "",
        catTitle: post.Category?.title || "",
        content: post.content || "",
        id: post.id,
        image: post.image || "",
        date: post.release ? new Date(post.release) : new Date(),
        links: Array.isArray(post.links)
          ? post.links.map((link: any) => ({
              id: Number(link.id),
              name: link.name,
              url: link.url,
            }))
          : [],
        nbComments: post.nbComments,
        nbView: post.nbView,
        slug: post.slug,
        team: [],
        title: post.title || "",
        trackList: Array.isArray(post.trackList)
          ? post.trackList.map((track: any) => ({
              id: Number(track.id),
              name: track.name,
              number: Number(track.number),
            }))
          : [],
      });
      setTitle(post.title || "");
      setCatSlug(post.Category?.slug || "");
      setContent(post.content || "");
      setImageUrl(post.image || "");
      setArtist(post.artist || "");
      const convertedTeam: TeamMember[] = Array.isArray(post.team)
        ? post.team.map((member: any, index: number) => {
            if (typeof member === "string") {
              const parts = member.split(" - ");
              return {
                id: `${index}`,
                name: parts[0]?.trim() || member,
                function: parts[1]?.trim() || "Musicien",
              };
            } else if (typeof member === "object" && member.name) {
              return {
                id: member.id || `${index}`,
                name: member.name,
                function: member.function || "Musicien",
              };
            }
            return {
              id: `${index}`,
              name: String(member),
              function: "Musicien",
            };
          })
        : [];
      setTeam(convertedTeam);
      setDate(post.release ? new Date(post.release) : new Date());
      setTracks(
        Array.isArray(post.trackList)
          ? post.trackList.map((track: any, index: number) => {
              // Si c'est une string JSON, il faut la parser
              const trackData =
                typeof track === "string" ? JSON.parse(track) : track;
              return {
                id: trackData.id || index + 1,
                name: trackData.name || "",
                number: trackData.number ? Number(trackData.number) : undefined,
              };
            })
          : []
      );
      const parsedLinks = Array.isArray(post.links)
        ? post.links.map((link: any, index: number) => {
            const linkData = typeof link === "string" ? JSON.parse(link) : link;
            return {
              id: linkData.id || index + 1,
              name: linkData.name || "",
              url: linkData.url || "",
            };
          })
        : [];

      setLinks(parsedLinks);
      setTempLink(parsedLinks);
    }
  }, [post]);

  const onChangeFile = (e: SyntheticEvent) => {
    const files = (e.target as HTMLInputElement).files;

    if (!files || !files[0]) return;

    setFile(files[0]);
    setImageObjectUrl(URL.createObjectURL(files[0]));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let url = imageUrl; // Garder l'URL existante

    try {
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        url = await uploadFile(formData);
      }
    } catch (error) {
      console.error("Error in uploadImage : ", error);
    }

    await mutate({
      title,
      content,
      catSlug: slugify(catSlug),
      slug: slugify(title),
      image: url !== "" ? url : imageUrl,
      release: date,
      artist,
      team,
      trackList: tracks,
      links: tempLink,
    });
  };

  const uploadImage: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      const formData = new FormData(e.currentTarget);
      const url = await uploadFile(formData);

      url && setImageUrl(url);
    } catch (error) {
      console.error("Error in uploadImage : ", error);
    }
  };

  useLayoutEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
  }, [router, status]);

  const handleOnChangeTeam = (data: TeamMember[]) => {
    setTeam(data);
  };
  const handleOnChangeTrackName = (data: any, el: Track) => {
    const tempTracks = tracks.map((item) => {
      if (item.id === el.id) {
        return { ...item, name: data.target.value };
      }
      return item;
    });
    setTracks(tempTracks);
  };
  const handleOnChangeTrackNumber = (data: any, el: Track) => {
    const tempTracks = tracks.map((item) => {
      if (item.id === el.id) {
        return { ...item, number: data.target.value };
      }
      return item;
    });
    setTracks(tempTracks);
  };
  const handleOnChangeLinkName = useCallback((data: any, el: Link) => {
    setTempLink((prevLinks) =>
      prevLinks.map((item) => {
        if (item.id === el.id) {
          return { ...item, name: data.target.value };
        }
        return item;
      })
    );
  }, []);

  const handleOnChangeLinkUrl = useCallback((data: any, el: Link) => {
    setTempLink((prevLinks) =>
      prevLinks.map((item) => {
        if (item.id === el.id) {
          return { ...item, url: data.target.value };
        }
        return item;
      })
    );
  }, []);

  const AddNewLink = () => {
    setTempLink((prev) => [
      ...prev,
      { id: prev.length + 1, name: "", url: "" },
    ]);
  };

  const AddNewTrack = () => {
    setTracks((prev) => [...prev, { id: prev.length + 1, name: "exemple" }]);
  };

  const supressTrack = () => {
    setTracks((prev) => prev.slice(0, prev.length - 1));
  };

  const supressLink = () => {
    setTempLink((prev) => prev.slice(0, prev.length - 1));
  };
  return (
    <main>
      <div className="p-10">
        {oldPost && (
          <form onSubmit={handleSubmit}>
            <PageTitle title={`Update ${oldPost.title}`} />
            <div className="mb-6">
              <div className="relative w-60 h-60 mx-auto mb-3 flex">
                <Image
                  className="object-cover rounded-full"
                  src={imageUrl ? imageUrl : "/img/disque.jpg"}
                  alt={title}
                  fill
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="image" className="text-slate-50 mb-3">
                  Image (optional) :
                </label>
                <p className="text-slate-400 text-sm">Upload an image </p>
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="image"
                      className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Choisir un fichier
                    </label>
                    <input
                      id="image"
                      type="file"
                      name="image"
                      onChange={onChangeFile}
                      accept="image/*"
                      className="hidden"
                    />
                    <span className="text-sm text-slate-400">
                      {file
                        ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
                        : "Aucun fichier sélectionné"}
                    </span>
                  </div>
                  {file && (
                    <p className="text-green-400 text-sm mt-2">
                      ✓ Nouveau fichier prêt à être uploadé
                    </p>
                  )}
                </div>
              </div>
            </div>

            <label htmlFor="artist" className="text-slate-50 mb-3">
              Artists or Band * :
            </label>
            <Input
              type="text"
              placeholder="Artist or band"
              className="mb-6"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />

            <label htmlFor="title" className="text-slate-50 mb-3">
              Title * :
            </label>
            <Input
              type="text"
              placeholder="Title"
              className="mb-6"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex flex-col gap-3 mb-5">
              <label htmlFor="team" className="mb-3">
                Team :
              </label>
              <TeamSelectorV2 team={team} onChange={setTeam} className="mb-3" />
              <label htmlFor="Links" className="underline mb-3">
                Tracks
              </label>
              {tracks.map((el, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="name"
                      id="name"
                      className="text-sm text-slate-400 mb-3"
                    >
                      Name :
                    </label>
                    <Input
                      type="text"
                      value={el.name}
                      placeholder="Track's name"
                      onChange={(data) => handleOnChangeTrackName(data, el)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="number"
                      id="number"
                      className="text-sm text-slate-400 mb-3"
                    >
                      track number :
                    </label>
                    <div className="flex gap-3">
                      <Input
                        value={el.number || ""}
                        type="number"
                        placeholder="Track's number"
                        onChange={(data) => handleOnChangeTrackNumber(data, el)}
                      />
                      <Button
                        className="bg-red-600"
                        type="button"
                        onClick={supressTrack}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex mb-5">
                <Button type="button" onClick={AddNewTrack}>
                  Add Another Track ?
                </Button>
              </div>
              <label htmlFor="Links" className="underline mb-3">
                Links{" "}
              </label>
              {tempLink.map((el: Link, index) => (
                <div
                  key={`${el.id}-${index}`}
                  className="grid md:grid-cols-2 gap-2"
                >
                  <div>
                    <label
                      htmlFor={`link-name-${el.id}-${index}`}
                      className="text-sm text-slate-400 mb-3"
                    >
                      Name :
                    </label>
                    <Input
                      id={`link-name-${el.id}-${index}`}
                      value={el.name}
                      type="text"
                      placeholder="Link's name"
                      onChange={(data) => handleOnChangeLinkName(data, el)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`link-url-${el.id}-${index}`}
                      className="text-sm text-slate-400 mb-3"
                    >
                      Link :
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id={`link-url-${el.id}-${index}`}
                        value={el.url}
                        type="url"
                        placeholder="https://..."
                        onChange={(data) => handleOnChangeLinkUrl(data, el)}
                      />
                      <Button
                        className="bg-red-600"
                        type="button"
                        onClick={supressLink}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex mb-5">
                <Button type="button" onClick={AddNewLink}>
                  Add Another Link ?
                </Button>
              </div>
            </div>
            <div className="flex flex-col mb-5">
              <label htmlFor="date" className="mb-3">
                Release :{" "}
              </label>
              <DatePickerDemo setDate={setDate} date={date} />
            </div>
            <label htmlFor="content" className="text-slate-50">
              Pourquoi aimez-vous cet album ?
            </label>
            <TiptapEditor
              className="mt-3"
              placeholder="Partagez votre passion pour cet album..."
              value={content}
              onChange={setContent}
            />
            <Button disabled={isLoading} className="mt-6" type="submit">
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
