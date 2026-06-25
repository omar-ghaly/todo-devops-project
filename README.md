# Todo DevOps Project

مشروع To-Do List كامل (Full-Stack) مبني كـ Portfolio لمقابلات DevOps، يغطي دورة حياة كاملة: تطوير، containerization، orchestration، CI/CD.

## التقنيات المستخدمة
- Backend: Node.js, Express 5, MongoDB (Mongoose), JWT Authentication
- Frontend: React, Vite
- Containerization: Podman (Docker-compatible), Podman Compose
- Orchestration: Kubernetes (Kind) - مكتمل ✅
- Package Management: Helm - قيد التنفيذ
- CI/CD: GitHub Actions - قيد التنفيذ
- Code Quality: SonarQube - قيد التنفيذ
- Testing: Jest, Cypress - قيد التنفيذ

## هيكل المشروع
todo-devops-project/
- backend/   (Node.js/Express API)
- frontend/  (React/Vite SPA)
- helm/      (Helm charts - قيد التنفيذ)
- k8s/       (Kubernetes manifests - مكتمل ✅)
- docker-compose.yml

## تشغيل المشروع محليًا

المتطلبات: Podman + podman-compose

تشغيل كل الخدمات:
podman-compose up -d

إيقاف الخدمات:
podman-compose down

عرض حالة الـ containers:
docker ps

بعد التشغيل، الموقع متاح على: http://SERVER_IP:8080

## API Endpoints
- POST /api/auth/register - تسجيل مستخدم جديد
- POST /api/auth/login - تسجيل دخول
- GET /api/tasks - عرض المهام (محمي بـ JWT)
- POST /api/tasks - إضافة مهمة (محمي بـ JWT)
- PUT /api/tasks/:id - تعديل مهمة (محمي بـ JWT)
- DELETE /api/tasks/:id - حذف مهمة (محمي بـ JWT)

## حالة المشروع
- [x] Backend APIs
- [x] Frontend
- [x] Containerization (Podman)
- [x] Docker Compose orchestration
- [x] Kubernetes (Kind)
- [ ] Helm Charts
- [ ] CI/CD (GitHub Actions)
- [ ] Code Quality (SonarQube)
- [ ] Automated Testing (Jest/Cypress)
