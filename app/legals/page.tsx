"use client";

export default function Legals(props: any) {
  return (
    <main className="flex flex-col flex-grow gap-10 justify-center items-center px-4">
      <div className="p-8 font-sans">
        <h1 className="text-3xl font-bold mb-4">Mentions Légales</h1>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. Éditeur du site</h2>
        <p className="mb-4">
          Le site <strong>Discophiles-blog</strong> est édité par{" "}
          <strong>Antoine Delbos</strong>, résidant au{" "}
          <strong>2 rue lancefoc à toulouse 31000</strong>.
        </p>
        <p className="mb-4">
          <strong>Contact :</strong> antoine.delbos.developpement@gmail.com
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. Hébergement</h2>
        <p className="mb-4">
          Le site est hébergé par <strong>Vercel</strong>, dont le siège social
          est situé au{" "}
          <strong>340 S Lemon Ave #4133 Walnut, CA 91789 USA</strong>.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          3. Propriété intellectuelle
        </h2>
        <p className="mb-4">
          L’ensemble des contenus (textes, images, vidéos, sons, etc.) présents
          sur le site <strong>Discophiles-blog</strong> sont protégés par les
          lois en vigueur sur la propriété intellectuelle et sont la propriété
          exclusive de <strong>Antoine Delbos</strong> ou de ses partenaires.
          Toute reproduction, représentation, modification, publication,
          adaptation de tout ou partie des éléments du site, quel que soit le
          moyen ou le procédé utilisé, est interdite, sauf autorisation écrite
          préalable de <strong>Antoine Delbos</strong>.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          4. Données personnelles
        </h2>
        <p className="mb-4">
          {`Conformément à la loi "Informatique et Libertés" du 6 janvier 1978
          modifiée, vous disposez d’un droit d’accès, de rectification et de
          suppression des données personnelles vous concernant. Pour exercer ce
          droit, vous pouvez nous contacter à`}{" "}
          <strong>contact@discophiles-blog.eu</strong>.
        </p>
      </div>
    </main>
  );
}
