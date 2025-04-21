import React from 'react';

export default function Forum() { 
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Forum</h1>
            <p className="mb-6">
                Participez à des discussions sur les plantes médicinales, partagez vos expériences et posez vos questions.
            </p>
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold">Discussions Récentes</h2>
                <ul className="mt-2">
                    <li className="border-b py-2">Discussion 1: Bienfaits de la Camomille</li>
                    <li className="border-b py-2">Discussion 2: Recettes à base de Gingembre</li>
                    <li className="border-b py-2">Discussion 3: Plantes pour le Stress</li>
                    <li className="border-b py-2">Discussion 4: Partagez vos astuces</li>
                </ul>
            </div>
            <div className="mt-6 bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold">Créer une Nouvelle Discussion</h2>
                <form className="mt-2">
                    <input
                        type="text"
                        placeholder="Titre de la discussion"
                        className="border rounded-lg w-full p-2 mb-4"
                    />
                    <textarea
                        placeholder="Votre message..."
                        className="border rounded-lg w-full p-2 h-32"
                    ></textarea>
                    <button type="submit" className="bg-[#E2F87B] text-[#316C40] px-4 py-2 rounded-lg mt-4">
                        Publier
                    </button>
                </form>
            </div>
        </div>
    );
}