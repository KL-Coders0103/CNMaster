export const calculateLevel =(totalXp: number) => {
        let level = 1;
        let xpRequired = 100;
        let currentLevelXp = totalXp;
        
        while ( currentLevelXp >= xpRequired) {
        currentLevelXp -= xpRequired;
        level++;
        xpRequired += 50;
    }

    return {
        level,
        totalXp,
        currentLevelXp,
        xpRequired,
    };
};