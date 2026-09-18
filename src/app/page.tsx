import ProjectBoard from './projects/projectboard';

const Home: React.FC = () => {
  return (
    <section className="w-full max-w-6xl px-4 py-6">
      <h1 className="mb-2 text-center text-3xl font-semibold text-white">Projects</h1>

      <p className="mb-4 text-center text-sm text-white/70">
        Pick a section in the header to focus on one area. Every section has its own link you can
        share or bookmark.
      </p>

      <ProjectBoard />
    </section>
  );
};

export default Home;
