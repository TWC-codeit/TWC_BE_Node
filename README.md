# TWC-Backend-Node
> Codeit Boost 데모 데이 [TWC]  
> 프로젝트 기간: 2024.12.30 ~ 2025.02.15

## Architecture

## Tech Stack
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white">  

<img src="https://img.shields.io/badge/postgreSQL-4169E1?style=for-the-badge&logo=postgreSQL&logoColor=white"> <img src="https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white">  

<img src="https://img.shields.io/badge/amazon EC2-FF9900?style=for-the-badge&logo=amazon ec2&logoColor=white"> <img src="https://img.shields.io/badge/amazon rds-527FFF?style=for-the-badge&logo=amazon rds&logoColor=white"> <img src="https://img.shields.io/badge/amazon s3-569A31?style=for-the-badge&logo=amazon s3&logoColor=white"> <img src="https://img.shields.io/badge/github actions-2088FF?style=for-the-badge&logo=github actions&logoColor=white"> <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/render-000000?style=for-the-badge&logo=render&logoColor=white">  

<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/vscode-000000?style=for-the-badge&logo=vscode&logoColor=white"> 

## Convention

### Branch
| 브랜치 | 설명 |
|----------|----------|
| main  | 제품으로 출시 (배포)| 
| develop   | 배포 전 작업 기준   | 
| feature  | 기능 단위 개발 및 수정 |
| hotfix   | 긴급 수정   |  

<details>
  <summary>Branch Details</summary>

  - **main**
    - 실제 서비스가 이루어지는 브랜치입니다.
    - 배포 중 긴급하게 수정할 건이 생길 시, hotfix 브랜치를 만들어 수정합니다.
  - **develop**
    - 개발, 테스트, 릴리즈 등 배포 전 작업의 기준이 되는 브랜치입니다.
    - main 브랜치에서 분기합니다.
    - 해당 브랜치를 default로 설정하고, 평소에는 이 브랜치를 기반으로 개발을 진행합니다.
    - 모든 기능이 추가되고 버그가 수정되어 배포 가능한 안정적인 상태라면 develop 브랜치를 main 브랜치에 merge합니다.
  - **feature**
    - 새로운 기능 개발 및 버그 수정이 필요할 때마다 develop 브랜치에서 분기하여 각 개발자가 맡은 작업을 개발하는 브랜치입니다.
    - 작업이 완료되면 develop 브랜치로 merge합니다.
  - **hotfix**
    - 배포한 버전에 긴급하게 수정을 해야할 필요가 있을 때 main 브랜치에서 분기하는 브랜치입니다.
    - 문제가 되는 부분 수정 후, main 브랜치에 merge하고 배포합니다.
    - hotfix 브랜치에서의 변경 사항은 develop 브랜치에도 merge합니다.

</details>


#### Branch Naming
1. main, develop  
   본래 이름 그대로 사용  
  
2. feature  
   `feature/{issue-number}-{feature-name}`  
    ex) feature/2-build-gradle-script
   
3. hotfix  
   `hotfix-{버전}`  
    ex) hotfix-1.2.1
   

### Commit Type
| **타입**    | **설명**                                                |
|-------------|--------------------------------------------------------|
| `feat`      | 새로운 기능 추가                                        |
| `fix`       | 버그 수정                                              |
| `test`      | 테스트 코드 추가, 수정                                 |
| `refactor`  | 기존 코드의 리팩토링 (기능 변화 없음)                  |
| `chore`     | 코드 외 작업 (예: 설정 변경, 라이브러리 설치/삭제)     |
| `build`     | 빌드 관련 작업 (예: 빌드 설정 수정, 종속성 설치/삭제)  |
| `docs`      | 문서 추가, 수정 (예: README 업데이트)                  |
| `ci`        | CI 설정 파일 추가, 수정                                |
| `perf`      | 성능 개선                                              |
| `style`     | 코드 포맷팅, 스타일 변경 (기능에 영향 없음)            |
| `comment`   | 코드에 필요한 주석 추가, 수정                          |
| `hotfix`    | 긴급한 치명적인 버그 수정                              |


#### Commit Message
```
// Header, Body는 빈 행으로 구분한다.

타입: 제목 (#이슈번호)     // Header(헤더)

본문      // Body(바디)
```  
ex)
```
fix: Safari에서 모달을 띄웠을 때 스크롤 이슈 수정 (#123)

모바일 사파리에서 Carousel 모달을 띄웠을 때,
모달 밖의 상하 스크롤이 움직이는 이슈 수정.
```

<details>
  <summary>Commit Message Rules</summary>
  
  1) 제목과 본문을 빈 행으로 구분한다.
  2) 제목은 50글자 이내로 제한한다.
  3) 제목의 첫 글자는 대문자로 작성한다.
  4) 제목 끝에는 마침표를 넣지 않는다.
  5) 제목은 명령문으로 사용하며 과거형을 사용하지 않는다.
  6) 본문은 72자마다 끊어 줄을 바꿔준다.
  7) 어떻게 보다는 무엇과 왜를 설명한다.
  8) 검토자가 원래 문제가 무엇인지 이해한다고 가정하지 말고 확실하게 설명을 추가한다.
  9) 자신의 코드가 직관적으로 바로 파악 할 수 있다고 생각하지 말자.
  10) 팀에서 정한 Commit 규칙을 따르자.

</details>


## Developers
<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/사용자명1">
          <img src="https://avatars.githubusercontent.com/HSK021843" width="100px" alt="사용자명1" />
          <br />
          <sub><b>김형석</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/사용자명2">
          <img src="https://avatars.githubusercontent.com/rosejinse" width="100px" alt="사용자명2" />
          <br />
          <sub><b>진소은</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/사용자명3">
          <img src="https://avatars.githubusercontent.com/yjhss" width="100px" alt="사용자명3" />
          <br />
          <sub><b>홍유진</b></sub>
        </a>
      </td>
    </tr>
  </tbody>
</table>


