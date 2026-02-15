import { validatorService } from "./src/js/services/validator-service.js";

async function test() {
  await validatorService.init();
  const articles = await validatorService.getArticlesByLaw("lei_2889_56");
  console.log("Articles for lei_2889_56:", articles);
}

test();
