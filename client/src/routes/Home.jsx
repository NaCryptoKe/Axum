import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlayerLibrary, getPopularGames, getNewGames } from "../auth/gameService";
import { useAuth } from "../auth/AuthContext";

export default function HomePage() {
    return (
        <h1>HELLO</h1>
    )
};