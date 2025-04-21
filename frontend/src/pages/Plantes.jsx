export default function Plantes() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Plantes Médicinales</h1>
            <p className="mb-6">
                Découvrez les bienfaits des plantes médicinales et comment elles peuvent améliorer votre santé.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Exemple de carte de plante */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold">Nom de la Plante</h2>
                    <p className="mt-2">Description de la plante et ses bienfaits.</p>
                </div>
                {/* Ajoutez d'autres cartes de plantes ici */}
            </div>
        </div>
    );
}