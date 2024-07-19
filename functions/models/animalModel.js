class Animal {
    constructor(name, status, gender, age, breed, color, size, reward, haveCollar, health, dateLastSeen, areaLastSeen, crossStreet, nearestLandmark, ddLat, ddLon, description, photos, specie, userId) {
        this.name = name;
        this.status = status;
        this.gender = gender;
        this.age = age;
        this.breed = breed;
        this.color = color;
        this.size = size;
        this.reward = reward;
        this.haveCollar = haveCollar;
        this.health = health;
        this.dateLastSeen = dateLastSeen;
        this.areaLastSeen = areaLastSeen;
        this.crossStreet = crossStreet;
        this.nearestLandmark = nearestLandmark;
        this.ddLat = ddLat;
        this.ddLon = ddLon;
        this.description = description;
        this.photos = photos;
        this.specie = specie;
        this.userId = userId;
    }
}

module.exports = Animal;
