// Member statistics functionality
export function calculateMemberStats(data) {
  // Get total members count
  const totalMembers = Object.values(data).reduce(
    (sum, category) => sum + category.length,
    0
  );

  // Get alumni count (from the alumni category)
  const alumniCount = data.alumni ? data.alumni.length : 0;

  // Count PhD students by checking degree property
  const phdCount = Object.values(data).reduce((count, members) => {
    return (
      count + members.filter((member) => member.degree === "doctor").length
    );
  }, 0);

  return {
    totalMembers,
    alumniCount,
    phdCount,
  };
}

export function animateCount(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentCount = Math.floor(progress * (end - start) + start);
    element.textContent = currentCount;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
