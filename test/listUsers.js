import supertest from "supertest";
const request = supertest("https://reqres.in/api/");

import { expect } from "chai";

describe("listUsers - positive testing", async () => {
  let pageCount;
  let total;
  let defaultPerPage;
  
  it("GET /users", async () => {
    // Get actual data to test against
    const res = await request.get("users");
    expect(res.body.data).to.not.be.empty;
    expect(res.body.page).to.be.eq(1); // Default page = 1
    pageCount = res.body.total_pages;
    total = res.body.total;
    defaultPerPage = res.body.per_page;
  });
  
  it(`GET /users?page=num`, async () => {
    // GET users by page number
    for (let i = 1; i < pageCount + 1; i++) {
      const res = await request.get(`users?page=${i}`);
      expect(res.body.data.length).to.be.eq(defaultPerPage);
      expect(res.body.page).to.be.eq(i);
      expect(res.body.per_page).to.be.eq(defaultPerPage);
      expect(res.body.total).to.be.eq(total);
    }
  });
  
  it(`GET /users?page=0`, async () => {
    // Test page=0
    const res = await request.get("users?page=0");
    expect(res.body.data.length).to.be.eq(defaultPerPage);
    expect(res.body.page).to.be.eq(1);
    expect(res.body.per_page).to.be.eq(defaultPerPage);
    expect(res.body.total).to.be.eq(total);
  });
  
  it("GET /users?page=pageCount + 1", async () => {
    // Check other pages are empty and dont return errors
    const res = await request.get(`users?page=${pageCount + 1}`);
    expect(res.statusCode).to.be.eq(200);
    expect(res.body.data).to.be.empty;
    expect(res.body.page).to.be.eq(pageCount + 1);
    expect(res.body.per_page).to.be.eq(defaultPerPage);
    expect(res.body.total).to.be.eq(total);
  });
  
  it("GET /users?per_page=total", async () => {
    // All rows on one page
    const res = await request.get(`users?per_page=${total}`);
    expect(res.body.per_page).to.be.eq(total);
    expect(res.body.page).to.be.eq(1);
    expect(res.body.total_pages).to.be.eq(1); // check there is only 1 page available
    expect(res.body.data.length).to.be.eq(total); //Check that all rows are present on the one page available
  });
  
  it("GET /users?per_page=total/2", async () => {
    // make page show half the total, should yeild 2 pages
    const res = await request.get(`users?per_page=${total / 2}`);
    expect(res.body.per_page).to.be.eq(total / 2);
    expect(res.body.page).to.be.eq(1);
    expect(res.body.total_pages).to.be.eq(2);
    expect(res.body.data.length).to.be.eq(total / 2);
  });
  
  it("GET /users?page=3&per_page=total/3", async () => {
    // make page show one third the total, should yeild 3 pages
    const res = await request.get(`users?page=3&per_page=${total / 3}`);
    expect(res.body.per_page).to.be.eq(total / 3);
    expect(res.body.page).to.be.eq(3);
    expect(res.body.total_pages).to.be.eq(3);
    expect(res.body.data).to.not.be.empty;
    expect(res.body.data.length).to.be.eq(total / 3);
  });
  
  it("GET /users/:id", async () => {
    // Get user by ID
    for (let i = 1; i < total + 1; i++) {
      // Loops for all available rows
      const res = await request.get(`users/${i}`);
      expect(res.body.data.id).to.be.eq(i);
    }
  });
  
  it("GET /users?per_page=3&delay=2", async () => {
    // Get 3 users per page and delay request by 2 seconds
    const res = await request.get("users?per_page=3&delay=2");
    expect(res.statusCode).to.be.eq(200);
    expect(res.body.per_page).to.be.eq(3);
    expect(res.body.page).to.be.eq(1);
    expect(res.body.total_pages).to.be.eq(total / 3);
    expect(res.body.data.length).to.be.eq(3);
  });
});
describe("listUsers - negative testing", async () => {
  let pageCount;
  let total;
  let defaultPerPage;
  
  it("GET /users", async () => {
    // Get available data to test against
    const res = await request.get("users");
    expect(res.body.data).to.not.be.empty;
    expect(res.body.page).to.be.eq(1); // Default page = 1
    pageCount = res.body.total_pages;
    total = res.body.total;
    defaultPerPage = res.body.per_page;
  });
  
  it("GET /users?page=wrongNum", async () => {
    // Get invalid page number, Should fail with a 404  (NOT FOUND)
    const res = await request.get("users?page=-1");
    expect(res.statusCode).to.be.equal(404); // THIS FAILS = Bug since this request should really return a 404
  });
  
  it("GET /users?per_page=-5", async () => {
    // invalid per_page value (negative value), breaks pagination
    const res = await request.get(`users?per_page=${total - 5}`);
    expect(res.statusCode).to.be.eq(400); // THIS FAILS = Bug, since this request should really return a 400 (Bad Request)
  });
  
  it("GET /users?per_page=0", async () => {
    //Get 0 rows per page is invalid and should fail but instead it returns defaults. This could be considered a bug by some QAs depending on specifications.
    const res = await request.get("users?per_page=0");
    expect(res.body.per_page).to.be.eq(defaultPerPage);
    expect(res.body.page).to.be.eq(1);
    expect(res.body.total_pages).to.be.eq(pageCount);
    expect(res.body.data.length).to.be.eq(defaultPerPage);
  });
  
  it("GET /users/:id = invalid", async () => {
    // List single user (invalid id)
    const res = await request.get(`users/${total + 1}`);
    expect(res.statusCode).to.be.eq(404);
    expect(res.body).to.be.empty;
  });
});
