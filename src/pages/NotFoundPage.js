import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { ROUTES } from "../config/routes";

/**
 * 404 page for unknown routes. Rendered when React Router matches path="*".
 */
function NotFoundPage() {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-4 mb-3">404</h1>
      <p className="gray-50 mb-4">The page you're looking for doesn't exist.</p>
      <Button variant="primary" as={Link} to={ROUTES.HOME}>
        Go home
      </Button>
    </Container>
  );
}

export default NotFoundPage;
