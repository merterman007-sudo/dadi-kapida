import { getServiceContent } from "./services-content";
import { locations, services } from "./site";

export function findCityBySlug(slug: string) {
  return locations.find((item) => item.slug === slug);
}

export function findServiceBySlug(slug: string) {
  return services.find((item) => item.slug === slug);
}

export function findServiceContentBySlug(slug: string) {
  return getServiceContent(slug);
}

export function buildCityParams() {
  return locations.map((city) => ({ city: city.slug }));
}

export function buildServiceCityParams() {
  return locations.flatMap((city) => services.map((service) => ({ city: city.slug, service: service.slug })));
}
