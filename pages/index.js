export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/home',
      permanent: false,
    },
  };
}

export default function IndexRedirect() {
  return null;
}
