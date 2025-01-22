class SignupDto {
  constructor(username, password, name, gender, birthDate) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.gender = gender;
    this.birthDate = birthDate;
  }
}

module.exports = SignupDto;