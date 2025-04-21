

export default function Blog() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Blog</h1>
            <p className="mb-6">
                Bienvenue sur notre blog ! Découvrez des articles intéressants sur les plantes médicinales, la santé et le bien-être.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Exemple de carte d'article de blog */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold">Titre de l'Article</h2>
                    <p className="mt-2">Résumé de l'article et ses points clés.</p>
                </div>
                {/* Ajoutez d'autres cartes d'articles ici */}
            </div>
        </div>
    );
}