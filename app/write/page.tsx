"use client";

import { DatePickerDemo } from "@/components/DatePicker";
import PageTitle from "@/components/PageTitle";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hook/useCategories";
import { Post, Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FormEventHandler,
  SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import QuillEditor from "@/components/QuillEditor";

import TeamSelectorV2 from "@/components/TeamSelectorV2";
import { Button } from "@/components/ui/button";
import { TeamMember } from "@/types";
import { slugify } from "@/utils/slugify";
import axios from "axios";
import { useMutation } from "react-query";
import Select from "react-select";
import { BounceLoader } from "react-spinners";
import { uploadFile } from "../api/upload/upload.action";

type Link = {
  id: number;
  name: string;
  url: string;
};
type Track = {
  id: number;
  name: string;
  number?: string;
};

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [artist, setArtist] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const teamRef = useRef<TeamMember[]>([]);

  const debugSetTeam = (newTeam: TeamMember[]) => {
    console.log("💾 setTeam called with:", newTeam);
    teamRef.current = newTeam;
    setTeam(newTeam);
  };

  useEffect(() => {
    teamRef.current = team;
  }, [team]);
  const [trackList, setTrackList] = useState<Prisma.JsonArray>([]);
  const [tracks, setTracks] = useState<Track[]>([{ id: 1, name: "" }]);
  const [links, setLinks] = useState<Prisma.JsonArray>([]);
  const [tempLink, setTempLink] = useState<Link[]>([
    { id: 1, name: "", url: "" },
  ]);
  const [date, setDate] = useState<Date | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [imageSizeError, setImageSizeError] = useState(false);

  const [file, setFile] = useState<File>();
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);

  const { data: categories, isFetching } = useCategories();

  const router = useRouter();

  const createPost = (newPost: Partial<Post>) =>
    axios.post("/api/posts", newPost).then((res) => res.data);

  const {
    mutate,
    data: createPostData,
    isLoading,
  } = useMutation(createPost, {
    onSuccess: (data: Post) => {
      router.push(`/posts/${data.slug}`);
    },
  });

  const { status } = useSession();

  const onChangeFile = (e: SyntheticEvent) => {
    setIsImage(true);
    const files = (e.target as HTMLInputElement).files;

    if (!files || !files[0]) return;

    setFile(files[0]);
    setImageObjectUrl(URL.createObjectURL(files[0]));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let url = "";
    try {
      if (!isImage) return;
      const formData = new FormData(e.currentTarget);
      const imageFile = formData.get("image");
      if (imageFile && imageFile instanceof File) {
        const size = imageFile.size;
        if (size > 2 * 1024 * 1024) {
          setImageSizeError(true);
          return;
        }
        url = await uploadFile(formData);
        if (url) {
          setImageUrl(url);
        }
      }
    } catch (error) {
      console.error("Error in uploadImage:", error);
    }

    setLinks(tempLink as Prisma.JsonArray);

    await mutate({
      title,
      content,
      catSlug: slugify(catSlug),
      slug: slugify(title),
      image: url,
      release: date,
      artist,
      team,
      trackList: trackList,
      links: links,
    });
  };
  const uploadImage: FormEventHandler<HTMLFormElement> = async (e) => {};

  useLayoutEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
  }, [router, status]);
  if (status === "loading") {
    return (
      <div className="h-[90vh] flex flx-col item-center justify-center">
        <BounceLoader color="#36d7b7" />
      </div>
    );
  }

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
    setTrackList(tempTracks as Prisma.JsonArray);
  };
  const handleOnChangeLinkName = (data: any, el: Link) => {
    const tempLinkName = tempLink.map((item) => {
      if (item.id === el.id) {
        return { ...item, name: data.target.value };
      }
      return item;
    });
    setTempLink(tempLinkName);
    setLinks(tempLinkName as Prisma.JsonArray);
  };
  const handleOnChangeLinkUrl = (data: any, el: Link) => {
    const tempLinkUrl = tempLink.map((item) => {
      if (item.id === el.id) {
        return { ...item, url: data.target.value };
      }
      return item;
    });
    setTempLink(tempLinkUrl);
    setLinks(tempLinkUrl as Prisma.JsonArray);
  };

  const AddNewLink = () => {
    setTempLink([...tempLink, { id: tempLink.length + 1, name: "", url: "" }]);
  };
  const AddNewTrack = () => {
    setTracks([...tracks, { id: tracks.length + 1, name: "exemple" }]);
  };

  return (
    <main>
      <div className="p-10">
        <form onSubmit={handleSubmit}>
          <PageTitle title="Write a new post" />
          {/* Image */}
          <div className="mb-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="image" className="text-slate-50 mb-3">
                Image (optional) :
              </label>
              {!imageSizeError ? (
                <p className="text-slate-400 text-sm">
                  Upload an image with max size 2Mb{" "}
                </p>
              ) : (
                <p className="text-red-500 text-sm">
                  Image size should be less than 2Mb
                </p>
              )}
              <Input type="file" name="image" onChange={onChangeFile} />
            </div>
          </div>

          <label htmlFor="artist" className="text-slate-50 mb-3">
            Artists or Band * :
          </label>
          <Input
            type="text"
            placeholder="Artist or band"
            className="mb-6"
            onChange={(e) => setArtist(e.target.value)}
            required={true}
          />

          <label htmlFor="title" className="text-slate-50 mb-3">
            Title * :
          </label>
          <Input
            type="text"
            placeholder="Title"
            className="mb-6"
            onChange={(e) => setTitle(e.target.value)}
            required={true}
          />

          <div className="flex flex-col gap-3 mb-5">
            <label htmlFor="team" className="mb-3">
              Team :
            </label>
            <TeamSelectorV2
              team={team}
              onChange={debugSetTeam}
              className="mb-3"
            />
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
                    placeholder="Track's name"
                    onChange={(data) => handleOnChangeTrackName(data, el)}
                    required={false}
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
                  <Input
                    type="number"
                    placeholder="Track's number"
                    onChange={(data) => handleOnChangeTrackNumber(data, el)}
                    required={false}
                  />
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
                    placeholder="Link's name"
                    onChange={(data) => handleOnChangeLinkName(data, el)}
                    required={false}
                  />
                </div>
                <div>
                  <label
                    htmlFor="link"
                    id="link"
                    className="text-sm text-slate-400 mb-3"
                  >
                    Link :
                  </label>
                  <Input
                    type="text"
                    placeholder="Link's url"
                    onChange={(data) => handleOnChangeLinkUrl(data, el)}
                    required={false}
                  />
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
          {isFetching ? (
            <div className="h-[90vh] flex flx-col item-center justify-center">
              <BounceLoader color="#36d7b7" />
            </div>
          ) : (
            <div className="text-slate-800 mb-10">
              <label htmlFor="category" className="text-slate-50 mb-3">
                Category *
              </label>
              <Select
                options={categories.map((el: { id: string; title: string }) => {
                  return {
                    id: el.id,
                    value: el.title,
                    label: el.title,
                  };
                })}
                onChange={(
                  newValue: { id: number; value: string; label: string } | null
                ) => newValue?.value && setCatSlug(newValue?.value)}
              />
            </div>
          )}
          <label htmlFor="content" className="text-slate-50">
            Why do you like this album ?
          </label>
          <QuillEditor
            className="mt-3"
            placeholder="Partagez votre passion pour cet album..."
            value={content}
            onChange={setContent}
          />
          <Button disabled={isLoading} className="mt-6" type="submit">
            {isLoading ? "Creating..." : "Publish"}
          </Button>
        </form>
      </div>
    </main>
  );
}
