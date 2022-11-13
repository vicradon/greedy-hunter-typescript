import MainLayout from "../src/Layouts/Main";

export default function Home() {
  return (
    <MainLayout>
      <h1 className="font-size-3-rem text-danger mb-4">Greedy Hunter</h1>
      <p className="text-primary mb-2">
        The aim is to eat all the food in record time
      </p>
      <p className="text-primary mb-2">Confiure your game grid below 👇🏼</p>
    </MainLayout>
  );
}
