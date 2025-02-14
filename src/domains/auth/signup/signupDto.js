class signupDto {
  constructor(username, password, name, gender, birthDate) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.gender = gender;
    this.birthDate = birthDate;
  }

  // DB에 저장할 때
  static convertGenderToEnglish(gender) {
    if (gender === '남성') return 'm';
    if (gender === '여성') return 'f';
    if (gender === '비공개') return 'n';
    return gender; // 유효하지 않은 값은 그대로 반환
  }

  // DB에서 값을 가져올 때
  static convertGenderToKorean(gender) {
    if (gender === 'm') return '남성';
    if (gender === 'f') return '여성';
    if (gender === 'n') return '비공개';
    return gender; // 유효하지 않은 값은 그대로 반환
  }
}

module.exports = signupDto;