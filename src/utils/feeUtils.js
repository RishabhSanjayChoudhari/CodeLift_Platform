/**
 * Fee Resolution Utility for CodeLift Courses & Cohorts
 * Ensures actual tuition fees configured in institutional Batches are fetched
 * and presented accurately across Home, Course Catalog, Course Details, and WhatsApp modals.
 */

/**
 * Resolves the true tuition fee of a course by cross-referencing attached Batches.
 *
 * @param {Object} course - The course object
 * @param {Array} batches - List of institutional batches
 * @returns {{ isFree: boolean, price: number, feeAmount: number, feeFormatted: string, originalPrice?: number, batchName?: string }}
 */
export function resolveCourseFee(course, batches = []) {
  if (!course) {
    return { isFree: true, price: 0, feeAmount: 0, feeFormatted: 'Free', originalPrice: null };
  }

  // 1. If explicitly free and has no linked batch, it's free
  const courseBatchIds = [
    ...(Array.isArray(course.batchIds) ? course.batchIds : []),
    ...(course.batchId ? [course.batchId] : [])
  ];

  // 2. Query attached institutional batches
  const matchingBatch = (batches || []).find((b) => {
    if (courseBatchIds.length > 0 && courseBatchIds.includes(b.id)) {
      return true;
    }
    if (Array.isArray(b.courseIds)) {
      return b.courseIds.includes(course.id) || (course.slug && b.courseIds.includes(course.slug));
    }
    return false;
  });

  if (matchingBatch && typeof matchingBatch.feeAmount === 'number' && matchingBatch.feeAmount > 0) {
    const fee = matchingBatch.feeAmount;
    return {
      isFree: false,
      price: fee,
      feeAmount: fee,
      feeFormatted: `₹${fee.toLocaleString('en-IN')}`,
      originalPrice: course.originalPrice || Math.round(fee * 1.3),
      batchName: matchingBatch.name
    };
  }

  // 3. Direct course fee or price if positive and not marked free
  const directPrice = Number(course.fee || course.price || 0);
  if (directPrice > 0 && course.isFree !== true) {
    return {
      isFree: false,
      price: directPrice,
      feeAmount: directPrice,
      feeFormatted: `₹${directPrice.toLocaleString('en-IN')}`,
      originalPrice: course.originalPrice || Math.round(directPrice * 1.3)
    };
  }

  // 4. Default to Free if marked free or price is 0
  if (course.isFree || directPrice === 0) {
    return {
      isFree: true,
      price: 0,
      feeAmount: 0,
      feeFormatted: 'Free',
      originalPrice: null
    };
  }

  return {
    isFree: false,
    price: directPrice,
    feeAmount: directPrice,
    feeFormatted: `₹${directPrice.toLocaleString('en-IN')}`,
    originalPrice: course.originalPrice || null
  };
}
