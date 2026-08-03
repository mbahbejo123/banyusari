import Image from "next/image";
import Link from "next/link";
import { 
  getPublicSettings, 
  getPublishedGallery 
} from "@/lib/data";

import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandWhatsapp,
} from "@tabler/icons-react";


const collaborationPartners = [
  {
    name: "Universitas Muhammadiyah Magelang",
    logo: "/logos/logo-unimma.png",
    width: 180,
    height: 180,
  },
  {
    name: "LPPM Universitas Muhammadiyah Magelang",
    logo: "/logos/logo-lppm-unimma.png",
    width: 190,
    height: 160,
  },
  {
    name: "LPPM Universitas Tidar",
    logo: "/logos/lppm-untidar.jpg",
    width: 190,
    height: 160,
  },
  {
    name: "Universitas Tidar",
    logo: "/logos/logo-untidar.png",
    width: 180,
    height: 180,
  },
] as const;


export default async function SiteFooter() {

  const [settings, gallery] = await Promise.all([
    getPublicSettings(),
    getPublishedGallery(),
  ]);


  return (
    <footer className="site-footer">

      <div className="container footer-grid">

        {/* PROFIL DESA */}
        <div>

          <h2>
            {settings?.village_name || "Desa Banyusari"}
          </h2>


          <p>
            <span>
              {settings?.address || 
              "Alamat kantor desa belum diisi oleh admin."}
            </span>
            {", "}

            <span>
              {
                [
                  settings?.district,
                  settings?.regency,
                  settings?.province,
                  settings?.postal_code,
                ]
                .filter(Boolean)
                .join(", ") ||
                "Wilayah administratif belum diisi."
              }
            </span>
          </p>



          {
            settings?.facebook_url ||
            settings?.instagram_url ||
            settings?.youtube_url ||
            settings?.phone
            ? (

            <div className="footer-sosmed">

              {
                settings.facebook_url ? (

                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="sosmed-link"
                    title="Facebook"
                  >
                    <div className="flex justify-center items-center w-full h-full">
                      <IconBrandFacebook size={20} />
                    </div>
                  </a>

                ) : null
              }



              {
                settings.instagram_url ? (

                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="sosmed-link"
                    title="Instagram"
                  >
                    <div className="flex justify-center items-center w-full h-full">
                      <IconBrandInstagram size={20}/>
                    </div>
                  </a>

                ) : null
              }



              {
                settings.youtube_url ? (

                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="sosmed-link"
                    title="YouTube"
                  >
                    <div className="flex justify-center items-center w-full h-full">
                      <IconBrandYoutube size={20}/>
                    </div>
                  </a>

                ) : null
              }



              {
                settings.phone ? (

                  <a
                    href={`https://wa.me/${settings.phone.replace(/\D/g,"")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="sosmed-link"
                    title="WhatsApp"
                  >
                    <div className="flex justify-center items-center w-full h-full">
                      <IconBrandWhatsapp size={20}/>
                    </div>
                  </a>

                ) : null
              }


            </div>

            )
            : null
          }


        </div>





        {/* MENU */}
        <div>

          <h3>
            Informasi
          </h3>


          <Link href="/profil">
            Profil Desa
          </Link>

          <Link href="/penduduk">
            Data Penduduk
          </Link>

          <Link href="/berita">
            Berita
          </Link>

          <Link href="/galeri">
            Galeri
          </Link>

          <Link href="/admin/login">
            Login Admin
          </Link>


        </div>





        {/* KONTAK */}
        <div>

          <h3>
            Kontak
          </h3>


          <p>
            {settings?.phone || 
            "Nomor telepon belum tersedia."}
          </p>


          <p>
            {settings?.email || 
            "Surel belum tersedia."}
          </p>



          {
            settings?.office_maps_url ? (

              <a
                className="button primary"
                href={settings.office_maps_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display:"inline-flex",
                  marginTop:12
                }}
              >

                Buka Google Maps

              </a>

            ) : null
          }


        </div>


      </div>






      {/* GALERI FOOTER MILIK TEMAN */}
      {
        gallery.length > 0 ? (

          <div className="container footer-gallery">

            <h3>
              Galeri Foto
            </h3>


            <div className="footer-gallery-grid">

              {
                gallery
                .slice(0,6)
                .map((item)=>(

                  <Link
                    key={item.id}
                    href="/galeri"
                    className="footer-gallery-thumb"
                  >

                    {
                      item.image_url ? (

                        <img
                          src={item.image_url}
                          alt={item.title || ""}
                        />

                      ) : null
                    }


                  </Link>

                ))
              }


            </div>


          </div>


        )
        : null
      }








      {/* BAGIAN KOLABORASI ANDA */}
      <section className="container collaboration-section">


        <div className="collaboration-heading">


          <span className="collaboration-label">
            KOLABORASI
          </span>


          <h3>
            Website Desa Banyusari dikembangkan melalui kolaborasi bersama:
          </h3>


          <p>
            Sinergi antara pemerintah desa dengan KKN PPMT UNIMMA dan KKN UNTIDAR dalam
            mendukung pengembangan pelayanan informasi digital Desa Banyusari.
          </p>


        </div>





        <div className="collaboration-logos">


          {
            collaborationPartners.map((partner)=>(


              <div
                className="collaboration-card"
                key={partner.name}
              >


                <div className="collaboration-logo-wrapper">


                  <Image

                    src={partner.logo}

                    alt={`Logo ${partner.name}`}

                    width={partner.width}

                    height={partner.height}

                    className="collaboration-logo"

                  />


                </div>




                <strong>
                  {partner.name}
                </strong>



              </div>


            ))
          }



        </div>



      </section>







      {/* COPYRIGHT */}

      <div className="container footer-bottom">


        <span>
          © 2026 Pemerintah Desa{" "}
          {settings?.village_name || "Banyusari"}
        </span>


      </div>



    </footer>
  );
}