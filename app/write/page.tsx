"use client";

import { DatePickerDemo } from "@/components/DatePicker";
import PageTitle from "@/components/PageTitle";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hook/useCategories";
import { Post } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FormEventHandler,
  SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import "react-quill/dist/quill.snow.css";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

import { Button } from "@/components/ui/button";
import { slugify } from "@/utils/slugify";
import axios from "axios";
import Image from "next/image";
import { useMutation } from "react-query";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { uploadFile } from "../api/upload/upload.action";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [artist, setArtist] = useState("");
  const [team, setTeam] = useState<string[]>([]);
  const [tempTrack, setTempTrack] = useState<string>("");
  const [links, setLinks] = useState<string[]>([]);
  const [tempLink, setTempLink] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);

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
    const files = (e.target as HTMLInputElement).files;

    if (!files || !files[0]) return;

    setFile(files[0]);
    setImageObjectUrl(URL.createObjectURL(files[0]));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const image = await uploadImage(e);

    setIsSubmit(true);
  };

  useEffect(() => {
    const submitDatas = async () => {
      if (
        isSubmit &&
        title !== "" &&
        content !== "" &&
        catSlug !== "" &&
        imageUrl !== "" &&
        artist !== "" &&
        !createPostData
      ) {
        await mutate({
          title,
          content,
          catSlug,
          slug: slugify(title),
          image: imageUrl,
          release: date,
        });
      }
    };
    submitDatas();
  }, [
    isSubmit,
    title,
    content,
    catSlug,
    imageUrl,
    mutate,
    createPostData,
    artist,
    date,
    links,
    team,
  ]);

  const uploadImage: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      const formData = new FormData(e.currentTarget);
      const url = await uploadFile(formData);
      url && (await setImageUrl(url));
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
    setTeam(data);
  };
  const handleOnChangeTracks = (data: any) => {
    setTeam(data);
  };
  const handleOnChangeLinks = (data: any) => {
    setTeam(data);
  };
  console.log(categories);

  return (
    <main>
      <div className="p-10">
        <form onSubmit={handleSubmit}>
          <PageTitle title="Write a new post" />
          {/* Image */}
          <div className="mb-6">
            {imageObjectUrl && (
              <div className="relative w-60 h-60 mx-auto mb-3 flex">
                <Image
                  className="object-cover rounded-full"
                  src={imageUrl ? imageUrl : imageObjectUrl}
                  fill
                  alt={title}
                />
              </div>
            )}
            <Input type="file" name="image" onChange={onChangeFile} />
          </div>
          {/* Title post */}
          <Input
            type="text"
            placeholder="Title"
            className="mb-6"
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Artist"
            className="mb-6"
            onChange={(e) => setArtist(e.target.value)}
          />
          <div className="flex flex-col gap-3 mb-5">
            <label htmlFor="team">Team :</label>
            <CreatableSelect
              isClearable
              isMulti
              onChange={handleOnChangeTeam}
            />
            <label htmlFor="tracks">Tracks :</label>
            <CreatableSelect
              isClearable
              isMulti
              onChange={handleOnChangeTracks}
            />
            <label htmlFor="Links">Links :</label>

            {/* Affecté link's name et link's url puis dupliquer onClick */}

            <div className="grid md:grid-cols-2 gap-2">
              <Input
                type="text"
                placeholder="Link's name"
                onChange={(e) => setTempLink(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Link's url"
                onChange={(e) => setTempLink(e.target.value)}
              />
            </div>
            <div className="flex mb-5">
              <Button onClick={() => {}}>Add Another Link ?</Button>
            </div>
          </div>
          <div className="mb-5">
            <DatePickerDemo setDate={setDate} date={date} />
          </div>
          {/* Category / select */}
          {isFetching ? (
            <p>Loading categories</p>
          ) : (
            <div className="text-slate-800">
              <Select
                options={categories.map((el: { id: string; title: string }) => {
                  return {
                    id: el.id,
                    value: el.title,
                    label: el.title,
                  };
                })}
                onChange={(
                  newValue: { slug: string } | null,
                  actionMeta: any
                ) => {
                  if (newValue) {
                    setCatSlug(newValue.slug);
                  }
                }}
              />
            </div>
          )}
          {/* Content */}
          <ReactQuill
            className="mt-6"
            placeholder="Write post content here..."
            value={content}
            onChange={setContent}
          />
          {/* Submit button */}
          <Button disabled={isLoading} className="mt-6" type="submit">
            {isLoading ? "Creating..." : "Publish"}
          </Button>
        </form>
      </div>
    </main>
  );
}
