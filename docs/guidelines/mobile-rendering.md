# 모바일 이미지 렌더링 개선 가이드라인

## 배경

데스크톱 디자인을 위해 적용된 `grayscale` 필터와 낮은 `opacity` 설정이 호버(Hover) 기능이 없는 모바일 환경에서 이미지를 어둡고 회색으로 보이게 하여 사용자 경험을 저하시키는 문제가 발생했습니다.

## 개선 원칙

1. **Mobile-First Visibility**:
   - 모바일(768px 미만)에서는 이미지가 기본적으로 원래의 색상(`grayscale-0`)과 충분한 밝기(`opacity-100`)를 유지해야 합니다.
   - 배경색이 비쳐 보이지 않도록 불투명도를 조정합니다.

2. **Responsive Grayscale**:
   - 세련된 디자인 의도를 위한 흑백 필터는 데스크톱 브레이크포인트(`md:grayscale`)에서만 적용합니다.
   - 호버 시 색상이 복원되도록 `group-hover:grayscale-0`와 `group-hover:opacity-100`을 함께 사용합니다.

3. **Smooth Transitions**:
   - 상태 변화 시 부드러운 전환을 위해 `transition-all` 또는 `transition-filter`를 적용합니다.

## 적용 사례 (Tailwind CSS)

```tsx
<img
  src={src}
  className="w-full h-full object-cover opacity-100 md:opacity-60 md:grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
/>
```

## 체크리스트

- [ ] 모바일에서 이미지가 컬러로 보이는가?
- [ ] 모바일에서 이미지의 불투명도가 적절하여 배경에 묻히지 않는가?
- [ ] 데스크톱에서 호버 시 의도한 애니메이션과 색상 복원이 일어나는가?
