# Cursor IDE 캐시 초기화 및 임시 데이터 삭제 가이드

문제 발생 시 Cursor IDE의 캐시·임시 데이터를 정리하는 방법입니다.

---

## 1. 빠른 조치 (권장 순서)

| 단계 | 내용                                                                           |
| ---- | ------------------------------------------------------------------------------ |
| 1    | **완전 재시작** – 창만 닫지 말고 Cursor를 완전히 종료 후 재실행                |
| 2    | **캐시만 삭제** – 아래 "캐시만 삭제" 경로 삭제 후 재시작                       |
| 3    | **워크스페이스 스토리지** – 채팅/워크스페이스 데이터까지 초기화 (선택)         |
| 4    | **완전 초기화** – `Application Support/Cursor` 전체 삭제 후 재설치 (최후 수단) |

---

## 2. macOS에서 삭제할 경로

### 2.1 캐시만 삭제 (설정·확장 유지)

다음 폴더만 삭제하면 됩니다. **Cursor를 종료한 뒤** 터미널에서 실행하세요.

```bash
# 기본 캐시
rm -rf ~/Library/Application\ Support/Cursor/Cache
rm -rf ~/Library/Application\ Support/Cursor/GPUCache
rm -rf ~/Library/Application\ Support/Cursor/CachedData
rm -rf ~/Library/Application\ Support/Cursor/"Code Cache"
rm -rf ~/Library/Application\ Support/Cursor/DawnWebGPUCache
rm -rf ~/Library/Application\ Support/Cursor/DawnGraphiteCache
```

또는 프로젝트에 있는 스크립트 실행 (캐시 + **과거 채팅 기록** 삭제):

```bash
# Cursor 종료 후
bash /Users/hyunjoong/hyunjoong/scripts/clear-cursor-cache.sh
```

위 스크립트는 캐시뿐 아니라 `User/workspaceStorage`(워크스페이스별 채팅 기록)까지 삭제합니다.

### 2.2 채팅·워크스페이스 데이터까지 삭제 (수동)

채팅 기록·워크스페이스별 상태까지 지우려면:

```bash
rm -rf ~/Library/Application\ Support/Cursor/User/workspaceStorage
```

- **주의:** 워크스페이스별 채팅 기록이 모두 삭제됩니다.

### 2.3 설정 초기화 (기본값으로 되돌리기)

설정을 초기화하려면 `settings.json` 이름만 바꿔 백업 후 Cursor를 다시 실행하세요.

```bash
mv ~/Library/Application\ Support/Cursor/User/settings.json \
   ~/Library/Application\ Support/Cursor/User/settings.json.backup
```

### 2.4 완전 초기화 (앱 데이터 전체 삭제)

모든 설정·캐시·워크스페이스 데이터를 지우고 처음부터 쓰려면:

```bash
# Cursor 완전 종료 후
rm -rf ~/Library/Application\ Support/Cursor
rm -rf ~/.cursor
rm -f ~/.cursor.json
```

이후 [cursor.sh](https://cursor.sh)에서 Cursor를 다시 설치합니다.

---

## 3. 로그·진단

| 목적              | 방법                                           |
| ----------------- | ---------------------------------------------- |
| 콘솔 오류 확인    | **Help → Toggle Developer Tools** → Console 탭 |
| 로그 폴더 열기    | **Help → Open Logs Folder**                    |
| 로그 경로 (macOS) | `~/Library/Application Support/Cursor/logs`    |

---

## 4. 주의사항

- **캐시/데이터 삭제 전에는 반드시 Cursor를 완전히 종료**한 뒤 진행하세요.
- Windows에서 안전 모드로 캐시를 수동 삭제하면 Cursor가 사라졌다는 보고가 있습니다. 가능하면 일반 부팅 상태에서 삭제하고, 문제 시 재설치를 권장합니다.
- VPN·Zscaler 사용 시 연결 문제가 있을 수 있으므로, 문제 재현 시 VPN 끄고 테스트해 보는 것이 좋습니다.

---

## 5. 참고

- Cursor 포럼: [forum.cursor.com](https://forum.cursor.com)
- 트러블슈팅: [cursor.fan – Troubleshooting](https://cursor.fan/troubleshooting/troubleshooting-guide)
