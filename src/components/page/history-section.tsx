export default function HistorySection() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
        Historia De La Comuna Bambil Collao
      </h1>

      <div className="space-y-8">
        <p className="text-lg text-justify leading-relaxed">
          <strong className="text-green-700">Este Sitio Desde El Año De 1.902,</strong>
          {" "}Cuyo Nombre Indígena Se Halla A Una Hora De La "Parroquia Colonche "Y Tiene
          Una Pequeña Población, Que Se Llega Sobre Unas De Las Tantas Lomas
          Blanquinosa Que Cual Oleaje Marino Se Extiende Más O Menos Regular, Hacia
          Unos Lados De La Cordillera Colonche, Sus{" "}
          <strong className="text-green-700">
            Casas Se Construían De Caña Gadúa Sus Paredes, Y La Cubierta De Cady
          </strong>
          , Por La Parte Derecha Se Encuentra El Rio Grande Y Se Une Con El{" "}
          <strong className="text-green-700">Rio Fernán Sánchez</strong>
          {" "}Sus Cauces. En Tiempos De Invierno Buenos Son Un MAR DE BENDICIONES, Para
          Luego Cosechar El Plátano, Yuca, Maíz, Y La Paja Toquilla, Que De La Misma
          Hacían Sombreros Y Lo Comercializaban.
        </p>

        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Primeros Pobladores</h2>
          <p className="text-justify leading-relaxed">
            Los Primeros Pobladores Que Fundaron Esta Población Las Siguientes Personas
            ,Familia{" "}
            <strong className="text-green-700">
              Tomalá ,Teran, Caiche, Rosales, Pavin Catuto, Tamayo Tomalá, Jacobo
              Catuto, Pedro Caiche, Jose Bacilio Tomala, Pedro Del Pezo
            </strong>
            ; Su Primer Presidente Fué El Señor{" "}
            <strong className="text-green-700">Tamayo Tomalá</strong>
            , Secretario El Señor{" "}
            <strong className="text-green-700">Aurelio Tomalá ,</strong>
            Como Primer Inspector El Señor{" "}
            <strong className="text-green-700">Florencio Tomalá</strong>
          </p>
        </div>

        <section className="border-l-4 border-green-500 pl-6">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Límites De La Comuna</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-green-700 mb-2">Norte</h3>
                <p className="text-justify">
                  Limita Con Las Posesiones De La Comuna{" "}
                  <strong>Loma Alta</strong>, Dede El Punto Conocido Como Cerro Verde
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-green-700 mb-2">Sur</h3>
                <p className="text-justify">
                  Limita Con La Comuna{" "}
                  <strong>Manantial De Colonche</strong>
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-green-700 mb-2">Este</h3>
                <p className="text-justify">
                  Limita Con La Comuna{" "}
                  <strong>Rio Seco</strong>
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-green-700 mb-2">Oeste</h3>
                <p className="text-justify">
                  Limita Con La Comuna{" "}
                  <strong>Sinchal-Barcelona</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-green-800 mb-6">Fiestas Religiosas</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-justify leading-relaxed">
              Nuestra Comuna{" "}
              <strong className="text-green-700">Bambil Collao</strong>
              {" "}Celebra Sus Fiestas Patronales Anualmente En Honor A Nuestra Patrona La{" "}
              <strong className="text-green-700">Virgen Maria Auxiliadora</strong>
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-green-800 mb-6">Bienes De La Comuna</h2>
          <div className="bg-green-50 p-6 rounded-lg shadow-sm">
            <p className="text-justify leading-relaxed">
              Nuestra Comuna Posee Con Una Iglesia, Casa Comunal, Una Escuela, Un
              Cementerio, Un Mercadillo, Una Cancha De Fútbol, Un Dispensario Médico, Un
              Centro Educativo Denominado,{" "}
              <strong className="text-green-700">
                C.P.R, Una Guarderia Infantil, C.D, I
              </strong>
              , Una Capilla Ardiente, Una Cancha De Uso Múltiple Y Además Una Ciudadela
              Llamada Narcisa De Jesús
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
