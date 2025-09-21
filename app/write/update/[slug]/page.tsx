"use client";

import { DatePickerDemo } from "@/components/DatePicker";
import PageTitle from "@/components/PageTitle";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hook/useCategories";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FormEventHandler,
  SyntheticEvent,
  use,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

// Extend the Post type to include all fields we're working with
interface Post {
  id: string;
  slug: string;
  title: string;
  catSlug: string;
  content: string;
  createdAt: Date;
  image: string | null;
  nbView: number;
  nbComments: number;
  userId: string;
  release: Date | null;
  artist: string;
  team: string[];
  trackList: any[];
  links: any[];
  catTitle?: string;
}

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {
  loading: () => (
    <div className="h-[90vh] flex flx-col item-center justify-center">
      <BounceLoader color="#36d7b7" />
    </div>
  ),
  ssr: false,
});

import { Button } from "@/components/ui/button";
import { usePost } from "@/hook/usePost";
import { slugify } from "@/utils/slugify";
import axios from "axios";
import Image from "next/image";
import { useMutation } from "react-query";
import CreatableSelect from "react-select/creatable";
import { BounceLoader } from "react-spinners";
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
  team: string[];
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
  const [team, setTeam] = useState<string[]>([]);
  const [tracks, setTracks] = useState<Track[]>([{ id: 1, name: "" }]);
  const [links, setLinks] = useState<Prisma.JsonArray>([]);
  const [tempLink, setTempLink] = useState<Link[]>([
    { id: 1, name: "", url: "" },
  ]);
  const [date, setDate] = useState<Date | null>(null);

  const [file, setFile] = useState<File>();
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);

  const { data: categories, isFetching } = useCategories();

  const router = useRouter();

  const updatePost = (updatePost: Partial<Post>) =>
    axios.put(`/api/update/${slug}`, updatePost).then((res) => res.data);

  const {
    mutate,
    data: updatePostData,
    isLoading,
  } = useMutation(updatePost, {
    onSuccess: (data: Post) => {
      router.push(`/posts/${data.slug}`);
    },
  });

  const { status } = useSession();

  useEffect(() => {
    if (post && post.id) {
      setOldPost({
        artist: post.artist,
        catTitle: post.catTitle,
        content: post.content,
        id: post.id,
        image: post.image,
        date: new Date(post.release),
        links: post.links.map((link) => ({
          id: Number(link.id),
          name: link.name,
          url: link.url,
        })),
        nbComments: post.nbComments,
        nbView: post.nbView,
        slug: post.slug,
        team: post.team,
        title: post.title,
        trackList: post.trackList.map((track) => ({
          id: Number(track.id),
          name: track.name,
          number: Number(track.number),
        })),
      });
      setTitle(post.title);
      setCatSlug(post.catSlug);
      setContent(post.content);
      setImageUrl(post.image);
      setArtist(post.artist);
      setTeam(post.team);
      setDate(new Date(post.release));
      setTracks(
        post.trackList.map((track) => ({
          id: Number(track.id),
          name: track.name,
          number: Number(track.number),
        }))
      );
      setLinks(post.links);
      setTempLink(
        post.links.map((link) => ({
          id: Number(link.id),
          name: link.name,
          url: link.url,
        }))
      );
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
    let url = "";
    try {
      if (file) {
        const formData = new FormData(e.currentTarget);
        url = await uploadFile(formData);
      }
    } catch (error) {
      console.error("Error in uploadImage : ", error);
    }

    setLinks(tempLink as Prisma.JsonArray);

    await mutate({
      title,
      content,
      catSlug: slugify(catSlug),
      // catTitle supprimé car non attendu par le type Post
      slug: slugify(title),
      image: url !== "" ? url : imageUrl,
      release: date,
      artist,
      team,
      trackList: tracks,
      links: links,
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

  const handleOnChangeTeam = (data: any) => {
    setTeam(data.map((el: { value: string }) => el.value as string));
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
  console.log(tempLink);

  const AddNewLink = () => {
    setTempLink([...tempLink, { id: tempLink.length + 1, name: "", url: "" }]);
  };
  const AddNewTrack = () => {
    setTracks([...tracks, { id: tracks.length + 1, name: "exemple" }]);
  };
  const supressTrack = () => {
    setTracks(tracks.slice(0, tracks.length - 1));
  };
  const supressLink = () => {
    setTempLink(tempLink.slice(0, tempLink.length - 1));
  };

  return (
    <main>
      <div className="p-10">
        {oldPost && (
          <form onSubmit={handleSubmit}>
            <PageTitle title="Write a new post" />
            {/* Image */}
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
                <Input type="file" name="image" onChange={onChangeFile} />
                {/* <p className="text-slate-400 text-sm">
                  Upload an image or paste an image url{" "}
                </p>
                <Input
                  type="string"
                  name="imageUrl"
                  placeholder="Image url"
                  onChange={(e) => setImageUrl(e.target.value)}
                /> */}
              </div>
            </div>
            {/* Title post */}

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
              <CreatableSelect
                value={team.map((el) => {
                  return { value: el, label: el };
                })}
                options={team.map((el) => ({ value: el, label: el }))}
                isClearable
                isMulti
                onChange={handleOnChangeTeam}
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
                        value={el.number}
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
                      value={el.name}
                      type="text"
                      placeholder="Link's name"
                      onChange={(data) => handleOnChangeLinkName(data, el)}
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
                    <div className="flex bg-red-600">
                      <Input
                        value={el.url}
                        type="text"
                        placeholder="Link's url"
                        onChange={(data) => handleOnChangeLinkUrl(data, el)}
                      />
                      <Button type="button" onClick={supressLink}>
                        x
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
            {/* Category / select */}

            {/* Content */}
            <label htmlFor="content" className="text-slate-50">
              Why do you like this album ?
            </label>
            <ReactQuill
              className="mt-3"
              placeholder="Write post content here..."
              value={content}
              onChange={setContent}
            />
            {/* Submit button */}
            <Button disabled={isLoading} className="mt-6" type="submit">
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
